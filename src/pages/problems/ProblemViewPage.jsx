/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Editor } from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import CodeViewerModal from './../dashboard/CodeViewerModal';
import {
  Play,
  Eye,
  Send,
  Settings,
  RotateCcw,
  Copy,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Bot,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../hooks/use-toast';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ScrollArea } from '../../components/ui/scroll-area';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
/* ─────────────────────────────────── helpers ─────────────────────────────────── */
const submissionsPerPage = 5;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getStatusIcon = (status) =>
  status === 'Accepted' ? (
    <CheckCircle className="h-4 w-4 text-green-400" />
  ) : (
    <XCircle className="h-4 w-4 text-red-400" />
  );

const getStatusColor = (status) => {
  if (status === 'Accepted') return 'text-green-400';
  if (status === 'Wrong Answer') return 'text-red-400';
  if (status === 'Time Limit Exceeded') return 'text-orange-400';
  if (status === 'Runtime Error') return 'text-yellow-400';
  return 'text-muted-foreground';
};

const getDifficultyColor = (d) =>
  d === 'easy'
    ? 'bg-green-500/20 text-green-400 border-green-500/30'
    : d === 'medium'
    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    : d === 'hard'
    ? 'bg-red-500/20 text-red-400 border-red-500/30'
    : 'bg-slate-500/20 text-slate-400 border-slate-500/30';

const getVerdictText = (v) => {
  if (!v) return 'Submit your code to see the verdict here...';
  const lines = [`Status: ${v.status}`];
  if (v.error) {
    lines.push(`\nError Details:\n${v.error}`);
  } else if (v.failedTestCase) {
    lines.push(
      '\nFailed Test Case:',
      `  Input: ${v.failedTestCase.input}`,
      `  Expected Output: ${v.failedTestCase.expectedOutput}`,
      `  Actual Output: ${v.failedTestCase.actualOutput}`
    );
  } else if (v.status === 'Accepted') {
    lines.push('\n✓ All test cases passed successfully!');
  }
  return lines.join('\n');
};

const getTotalPagesFromTotal = (t) => Math.ceil(t / submissionsPerPage);

/* ───────────────────────────── Submission list ──────────────────────────────── */
function SubmissionList({ handleViewCode, submissions, page, setPage, total = 0 }) {
  const totalPages = getTotalPagesFromTotal(total);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">My Submissions</h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(Math.max(1, page - 1))}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {page}/{totalPages || 1}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {submissions.map((s) => (
          <div key={s.id} className="leetcode-card p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(s.status)}
              <div>
                <div className="text-sm font-medium text-foreground">{s.language}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(s.submittedAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`text-sm font-medium ${getStatusColor(s.status)}`}>{s.status}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewCode(s)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────── Main page ───────────────────────────────── */
const ProblemViewPage = () => {
  /* Router + global state */
  const { id } = useParams();
  const { toast } = useToast();

  /* Code editor state */
  const [code, setCode] = useState(
    `  #include <bits/stdc++.h>
    using namespace std;
    int main() {
      // Write C++ code here
      return 0;
    }`
  );
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  /* Submission state */
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [verdict, setVerdict] = useState(null);

  /* Tabs */
  const [activeTab, setActiveTab] = useState('description');

  /* Paginated submissions */
  const [mySubmissionPage, setMySubmissionPage] = useState(1);

  /* Code modal */
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const handleViewCode = (s) => {
    setSelectedSubmission(s);
    setIsCodeModalOpen(true);
  };

  /* ── NEW: AI Review state */
  const [aiReview, setAiReview] = useState(null);
  const [loadingAiReview, setLoadingAiReview] = useState(false);
  const [selectedTab, setSelectedTab] = useState("testcase");

  /* Fetch problem details */
  const {
    data: problem,
    isLoading: isLoadingProblem,
    isError: isErrorProblem,
  } = useQuery({
    queryKey: ['problem', id],
    queryFn: () =>
      axios
        .get(`${BASE_URL}/api/problems/${id}`, { withCredentials: true })
        .then((r) => r.data),
    enabled: !!id,
  });

  /* Fetch paginated submissions */
  const {
    data: mySubmissionsData,
    isLoading: isLoadingMySubs,
    isError: isErrorMySubs,
  } = useQuery({
    queryKey: ['mySubmissions', id, mySubmissionPage],
    queryFn: () =>
      axios
        .get(
          `${BASE_URL}/api/submissions/problem/${id}/mine?page=${mySubmissionPage}&limit=${submissionsPerPage}`,
          { withCredentials: true }
        )
        .then((r) => r.data),
    enabled: !!id,
    keepPreviousData: true,
  });

  /* ─────────────────────────── AI Review handler ─────────────────────────── */
  const handleAiReview = async () => {
    if (!problem || !code) return;
    setActiveTab('ai-review');
    setLoadingAiReview(true);
    setAiReview(null);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/ai/ai-review`,
        { problem, code },
        { withCredentials: true }
      );
      if (res.data.success) {
        setAiReview(res.data.review);
      } else {
        toast({
          title: 'AI Review Failed',
          description: res.data.error,
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || err.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingAiReview(false);
    }
  };

  /* ───────────────────── language template switch ────────────────────────── */
  const getBoilerplate = (lang) => {
    switch (lang) {
      case "cpp":
        return `  #include <bits/stdc++.h>
  using namespace std;
  int main() {
  // Write C++ code here
    return 0;
  }`;
      case "python":
        return `  print("write your logic")`;
      case "java":
        return  `  class Main {
      public static void main(String[] args) {
      System.out.println("Try CodeJudge");
    }
  }`;
      default:
        return "";
    }
  };
  
  useEffect(() => {
    setCode(getBoilerplate(language));
  }, [language]);

  const handleRun = async () => {
    setSelectedTab("result");
    setIsRunning(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/submissions/run`,
        { code, language, input },
        { withCredentials: true }
      );
      const result = response.data;
      setIsRunning(false);
      if (result.message === 'Code ran successfully') {
        const { input: inp, output: out, error: err } = result.results[0];
        setOutput(`Input: ${inp || 'No input provided'}\nOutput: ${out || 'No output'}\nError: ${err || 'No error'}`);
        toast({ title: 'Code Executed', description: 'Your code ran successfully!' });
      } else {
        setOutput(`Error: ${result.message}`);
        toast({ title: 'Execution Failed', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      setIsRunning(false);
      setOutput(`Error: ${error.message}`);
      toast({ title: 'Execution Failed', description: error.response?.data?.message || error.message, variant: 'destructive' });
    }
  };

  const handleSubmit = async () => {
    setSelectedTab("verdict");
    setIsSubmitting(true);
    setVerdict(null);
    setSubmissionId(null);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/submissions`,
        { problemId: id, code, language },
        { withCredentials: true }
      );
      const { submission } = response.data;
      setSubmissionId(submission._id);
      toast({ title: '🕓 Submission Queued', description: 'Your solution has been submitted and is being evaluated.' });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: '❌ Submission Failed',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    let intervalId;
    if (submissionId && isSubmitting) {
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/submissions/result/${submissionId}`, { withCredentials: true });
          const { status, failedTestCase, error } = response.data;
          if (status !== 'Pending' && status !== undefined) {
            setIsSubmitting(false);
            setVerdict({ status, failedTestCase, error });
            clearInterval(intervalId);
            toast({
              title: `Submission status ${status}`,
              description:
                status === 'Accepted'
                  ? 'Your solution passed all test cases!'
                  : status === 'TLE'
                  ? undefined
                  : error
                  ? `💥 Error: ${error}`
                  : `❌ Failed on test case:\nInput=${failedTestCase?.input}\nExpected=${failedTestCase?.expectedOutput}\nGot=${failedTestCase?.actualOutput}`,
              variant: status === 'Accepted' ? 'default' : 'destructive',
            });
            
          }
        } catch (error) {
          setIsSubmitting(false);
          clearInterval(intervalId);
          setVerdict({ status: 'Error', error: error.message });
          toast({ title: '🚨 Submission Check Failed', description: error.response?.data?.message || error.message, variant: 'destructive' });
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [submissionId, isSubmitting, toast]);

  const handleReset = () => {
    setCode(getBoilerplate(language));
    setOutput('');
    setInput('');
    setVerdict(null);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    toast({ title: 'Code Copied', description: 'Code copied to clipboard!' });
  };
  if (isLoadingProblem) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }
  if (isErrorProblem || !problem) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="text-white text-xl">Problem not found</div>
        </div>
      </Layout>
    );
  }

  /* ─────────────────────────────── JSX ────────────────────────────────────── */
  return (
    <Layout showFooter={false}>
      <div className="h-screen bg-slate-950 text-white overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* ─────────────────────── Left panel ─────────────────────── */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-slate-950 border-r border-slate-800">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                    <TabsList className="bg-slate-900 border border-slate-700">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="mysubmissions">
                        <User className="mr-1 h-4 w-4" />
                        My Submissions
                      </TabsTrigger>
                      <TabsTrigger value="ai-review">
                        <Bot className="mr-1 h-4 w-4" />
                        AI Review
                      </TabsTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAiReview}
                        className="ml-auto text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        Generate Review
                      </Button>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                    <>
                        <div className="mb-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h1 className="text-xl font-medium text-foreground mb-2">{problem.title}</h1>
                              <div className="flex items-center gap-3 mb-4">
                                <Badge className={`${getDifficultyColor(problem.difficulty)} border`}>
                                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                </Badge>
                                <div className="flex items-center gap-1 text-muted-foreground text-sm">

                                  <span>{problem.acceptanceRate}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {problem.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Separator className="bg-slate-800 mb-6" />
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-slate-200">Problem Statement</h3>
                            <div className="text-slate-300 leading-relaxed whitespace-pre-line">{problem.statement}</div>
                          </div>
                          {problem.inputFormat && (
                            <div>
                              <h3 className="text-lg font-semibold mb-3 text-slate-200">Input Format</h3>
                              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <code className="text-slate-300 text-sm whitespace-pre-line">{problem.inputFormat}</code>
                              </div>
                            </div>
                          )}
                          {problem.outputFormat && (
                            <div>
                              <h3 className="text-lg font-semibold mb-3 text-slate-200">Output Format</h3>
                              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <code className="text-slate-300 text-sm whitespace-pre-line">{problem.outputFormat}</code>
                              </div>
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-slate-200">Examples</h3>
                            {problem.sampleTestCases.map((testCase, index) => (
                              <div key={index} className="mb-4 bg-slate-900/30 p-4 rounded-lg border border-slate-800">
                                <div className="font-medium text-slate-200 mb-2">Example {index + 1}:</div>
                                <div className="grid grid-cols-1 gap-3">
                                  <div>
                                    <div className="text-sm font-medium text-slate-400 mb-1">Input:</div>
                                    {/* Note: The outer div is the styled container, so <pre> doesn't need styles */}
                                    <div className="bg-slate-900 p-2 rounded border border-slate-700 font-mono text-sm">
                                      <pre className="text-green-400">{testCase.input}</pre>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-slate-400 mb-1">Output:</div>
                                    <div className="bg-slate-900 p-2 rounded border border-slate-700 font-mono text-sm">
                                      <pre className="text-blue-400">{testCase.output}</pre>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-slate-200">Constraints</h3>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                              <code className="text-slate-300 text-sm whitespace-pre-line">{problem.constraints}</code>
                            </div>
                          </div>
                        </div>
                      </>
                    </TabsContent>

                    {/* ─────────────── My Submissions tab ─────────────── */}
                    <TabsContent value="mysubmissions" className="mt-6">
                      {isLoadingMySubs ? (
                        <div className="text-center text-slate-300 py-6">Loading your submissions...</div>
                      ) : isErrorMySubs ? (
                        <div className="text-center text-red-500 py-6">Failed to load your submissions.</div>
                      ) : (
                        <SubmissionList
                          handleViewCode={handleViewCode}
                          submissions={(mySubmissionsData?.submissions || []).map((s) => ({
                            ...s,
                            id: s._id || s.id,
                          }))}
                          page={mySubmissionPage}
                          setPage={setMySubmissionPage}
                          total={mySubmissionsData?.total || 0}
                        />
                      )}
                    </TabsContent>

                    {/* ─────────────── AI Review tab ─────────────── */}
                    <TabsContent value="ai-review" className="mt-6">
                      {loadingAiReview ? (
                        <div className="flex items-center justify-center py-10">
                          <LoadingSpinner size="md" />
                          <span className="ml-3 text-slate-300">Generating AI feedback...</span>
                        </div>
                      ) : aiReview ? (
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-5 text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {aiReview}
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 py-6">
                          Click “Generate Review” to get AI feedback on your solution.
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </div>
          </Panel>

          <PanelResizeHandle withHandle />
          {/* Right Panel - Code Editor, Run, Submit, Verdict */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={40}>
                <div className="h-full bg-slate-950 flex flex-col">
                  <div className="border-b border-slate-800 p-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[120px] bg-slate-800 border border-slate-700 text-white text-sm">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white border-slate-700">
                          {/* <SelectItem value="javascript">JavaScript</SelectItem> */}
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                        </SelectContent>
                      </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={copyCode} className="text-slate-400 hover:text-white hover:bg-slate-800">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-white hover:bg-slate-800">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      language={language}
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineHeight: 21,
                        fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                        scrollBeyondLastLine: false,
                        renderLineHighlight: 'line',
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 3,
                      }}
                    />
                  </div>
                </div>
              </Panel>
              <PanelResizeHandle withHandle />
              <Panel defaultSize={30} minSize={20}>
                <div className="h-full bg-slate-950 border-t border-slate-800">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full h-full flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 flex-shrink-0">
                      <TabsList className="bg-slate-900 border border-slate-700">
                        <TabsTrigger
                          value="testcase"
                          className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                        >
                          Testcase
                        </TabsTrigger>
                        <TabsTrigger
                          value="result"
                          className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                        >
                          Result
                        </TabsTrigger>
                        <TabsTrigger
                          value="verdict"
                          className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                        >
                          Verdict
                        </TabsTrigger>
                      </TabsList>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={handleRun}
                          disabled={isRunning}
                          size="sm"
                          className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                        >
                          {isRunning ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Run
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <TabsContent value="testcase" className="h-full p-4 overflow-hidden">
                        <ScrollArea className="h-full">
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Custom Input</label>
                            <Textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder="Enter your test input..."
                              className="bg-slate-900 border-slate-700 text-white resize-none h-24"
                            />
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="result" className="h-full p-4 overflow-hidden">
                        <ScrollArea className="h-full">
                          <div className="bg-slate-900 border border-slate-700 rounded p-3 h-full">
                            <pre className="text-slate-300 text-sm whitespace-pre-wrap">
                              {output || 'Run your code to see the output here...'}
                            </pre>
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="verdict" className="h-full p-4 overflow-hidden">
                        <ScrollArea className="h-full">
                          <div className="bg-slate-900 border border-slate-700 rounded p-3 h-full">
                            {isSubmitting ? (
                              <div className="flex items-center justify-center h-full">
                                <div className="flex items-center space-x-2 text-slate-300">
                                  <LoadingSpinner size="sm" />
                                  <span>Processing submission...</span>
                                </div>
                              </div>
                            ) : verdict ? (
                              <pre className="text-slate-300 text-sm whitespace-pre-wrap">
                                {getVerdictText(verdict)}
                              </pre>
                            ) : (
                              <div className="text-slate-300 text-sm flex items-center justify-center h-full">
                                Submit your code to see the verdict here...
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

        </PanelGroup>
      </div>

      {/* ─────────────── Code viewer modal ─────────────── */}
      <CodeViewerModal
        submission={selectedSubmission}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </Layout>
  );
};

export default ProblemViewPage;
