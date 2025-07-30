import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, FileCode, ListChecks, Type, Info, X, Upload, CheckCircle } from 'lucide-react';
import { createProblem as createProblemAPI } from '../../../services/problemsService';
import ProblemSuccessCard from './ProblemSuccessCard';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { Badge } from '../../../components/ui/badge';
import { Label } from '../../../components/ui/label';
import { useToast } from '../../../hooks/use-toast';
import Layout from '../../../components/layout/Layout';
import { PROBLEM_DIFFICULTIES } from '../../../utils/constant';

const TextareaSection = ({ label, field, value, onChange, placeholder }) => (
  <div>
    <Label htmlFor={field} className="text-gray-300">{label}</Label>
    <Textarea
      id={field}
      value={value}
      onChange={e => onChange(field, e.target.value)}
      rows={5}
      placeholder={placeholder}
      className="bg-gray-700/80 border-gray-600 mt-2 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

const TestCaseCard = ({ type, title, description, testCases, onTestCaseChange, onAddTestCase, onRemoveTestCase, onFileLoad }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/json') return;
    setFileName(file.name);
    onFileLoad(file);
  };

  return (
    <Card className="border-gray-600 bg-gray-800/80 text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-gray-100">{title}</CardTitle>
            <CardDescription className="text-gray-400">{description}</CardDescription>
          </div>
          {type === 'hidden' && (
            <div className="flex items-center gap-4">
              {fileName && (
                <span className="text-sm text-green-400 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {fileName}
                </span>
              )}
              <Input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload JSON
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          {testCases.map((tc, i) => (
            <div key={i} className="border border-gray-600 rounded-lg p-4 mb-4 bg-gray-900/50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-200">
                  {type === 'sample' ? 'Sample' : 'Test'} Case #{i + 1}
                </h4>
                {testCases.length > 1 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveTestCase(type, i)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 border-gray-600 text-white">
                      <p>Remove</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Input</Label>
                  <Textarea
                    value={tc.input}
                    onChange={e => onTestCaseChange(type, i, 'input', e.target.value)}
                    rows={4}
                    className="bg-gray-700/80 border-gray-600 mt-2 text-white font-mono placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Output</Label>
                  <Textarea
                    value={tc.output}
                    onChange={e => onTestCaseChange(type, i, 'output', e.target.value)}
                    rows={4}
                    className="bg-gray-700/80 border-gray-600 mt-2 text-white font-mono placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              {type === 'sample' && (
                <div>
                  <Label className="text-gray-300">Explanation</Label>
                  <Textarea
                    value={tc.explanation}
                    onChange={e => onTestCaseChange(type, i, 'explanation', e.target.value)}
                    rows={3}
                    className="bg-gray-700/80 border-gray-600 mt-2 text-white font-mono placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ))}
        </TooltipProvider>
        <Button
          type="button"
          onClick={() => onAddTestCase(type)}
          variant="outline"
          className="mt-4 border-dashed border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400 w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Manual Case
        </Button>
      </CardContent>
    </Card>
  );
};

const CreateProblemPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createProblemAPI,
    onSuccess: () => {
      toast({ variant: 'success', title: 'Problem created!' });
      queryClient.invalidateQueries('problems');
    },
    onError: err => {
      toast({ variant: 'destructive', title: 'Creation failed', description: err.message });
    },
  });

  const initialForm = {
    title: '',
    statement: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    sampleTestCases: [{ input: '', output: '' }],
    testCases: [{ input: '', output: '', explanation: '' }],
    difficulty: 'easy',
    tags: []
  };

  const [formData, setFormData] = useState(initialForm);
  const [tagInput, setTagInput] = useState('');
  const [testCaseFile, setTestCaseFile] = useState(null);

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('Title is required.');
    if (formData.tags.length === 0) errors.push('At least one tag is required.');
    if (!formData.statement.trim()) errors.push('Description is required.');
    if (!formData.inputFormat.trim()) errors.push('Input format is required.');
    if (!formData.outputFormat.trim()) errors.push('Output format is required.');
    if (!formData.constraints.trim()) errors.push('Constraints are required.');
    if (formData.sampleTestCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
      errors.push('All sample cases must have input and output.');
    }
    const hasManual = formData.testCases.every(tc => tc.input.trim() && tc.output.trim());
    if (!testCaseFile && !hasManual) {
      errors.push('Provide hidden tests via file or manual cases.');
    }
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { isValid, errors } = validateForm();
    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'Validation Errors',
        description: errors.join('\n')
      });
      return;
    }
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, Array.isArray(val) ? JSON.stringify(val) : val);
    });
    if (testCaseFile) data.append('testCaseFile', testCaseFile);
    mutation.mutate(data);
  };

  const resetAll = () => {
    mutation.reset();
    setFormData(initialForm);
    setTagInput('');
    setTestCaseFile(null);
  };

  if (mutation.isSuccess) {
    return <ProblemSuccessCard problem="created" onReset={resetAll} />;
  }

  const onChangeField = (f, v) => setFormData(p => ({ ...p, [f]: v }));
  const changeTestCase = (type, i, field, v) => {
    const key = type === 'sample' ? 'sampleTestCases' : 'testCases';
    const arr = [...formData[key]];
    arr[i] = { ...arr[i], [field]: v };
    setFormData(p => ({ ...p, [key]: arr }));
  };
  const addTestCase = type => {
    const key = type === 'sample' ? 'sampleTestCases' : 'testCases';
    setFormData(p => ({ ...p, [key]: [...p[key], { input: '', output: '', explanation: '' }] }));
  };
  const removeTestCase = (type, i) => {
    const key = type === 'sample' ? 'sampleTestCases' : 'testCases';
    if (formData[key].length > 1) {
      setFormData(p => ({ ...p, [key]: p[key].filter((_, idx) => idx !== i) }));
    }
  };
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !formData.tags.includes(t)) {
      setFormData(p => ({ ...p, tags: [...p.tags, t] }));
      setTagInput('');
    }
  };
  const removeTag = tag => setFormData(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }));

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto py-8 px-4 max-w-5xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileCode className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Create Problem</h1>
              <p className="text-gray-400 text-lg">Craft a new challenge for the community</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-600">
                <TabsTrigger value="basic" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Info className="mr-2 h-4 w-4" />Basic Info</TabsTrigger>
                <TabsTrigger value="statement" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Type className="mr-2 h-4 w-4" />Statement</TabsTrigger>
                <TabsTrigger value="samples" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"><ListChecks className="mr-2 h-4 w-4" />Sample Cases</TabsTrigger>
                <TabsTrigger value="tests" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"><ListChecks className="mr-2 h-4 w-4" />Hidden Tests</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <Card className="border-gray-600 bg-gray-800/80 text-white">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Basic Information</CardTitle>
                    <CardDescription className="text-gray-400">Provide the title, difficulty, and tags for your problem.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-gray-300">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={e => onChangeField('title', e.target.value)}
                        placeholder="e.g., Two Sum"
                        className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty" className="text-gray-300">Difficulty</Label>
                      <Select value={formData.difficulty} onValueChange={v => onChangeField('difficulty', v)}>
                        <SelectTrigger className="bg-gray-700/80 border-gray-600 text-white h-12 focus:ring-1 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          <SelectItem value={PROBLEM_DIFFICULTIES.EASY}>Easy</SelectItem>
                          <SelectItem value={PROBLEM_DIFFICULTIES.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={PROBLEM_DIFFICULTIES.HARD}>Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags" className="text-gray-300">Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          placeholder="Add a tag and press Enter"
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12"
                        />
                        <Button type="button" onClick={addTag} variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 h-12">Add</Button>
                      </div>
                      <div className="flex gap-2 flex-wrap min-h-[2rem]">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="bg-gray-700/80 text-gray-300 border-gray-600 text-sm py-1">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-gray-600">
                              <X className="h-4 w-4"/>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="statement">
                <Card className="border-gray-600 bg-gray-800/80 text-white">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Problem Statement</CardTitle>
                    <CardDescription className="text-gray-400">Clearly describe the problem, formats, and constraints.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <TextareaSection label="Problem Description" field="statement" value={formData.statement} onChange={onChangeField} placeholder="A clear and concise description..." />
                    <TextareaSection label="Input Format" field="inputFormat" value={formData.inputFormat} onChange={onChangeField} placeholder="Describe input format." />
                    <TextareaSection label="Output Format" field="outputFormat" value={formData.outputFormat} onChange={onChangeField} placeholder="Describe output format." />
                    <TextareaSection label="Constraints" field="constraints" value={formData.constraints} onChange={onChangeField} placeholder="e.g., 2 <= n <= 10^5" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="samples">
                <TestCaseCard
                  type="sample"
                  title="Sample Test Cases"
                  description="Visible examples for users."
                  testCases={formData.sampleTestCases}
                  onTestCaseChange={changeTestCase}
                  onAddTestCase={addTestCase}
                  onRemoveTestCase={removeTestCase}
                />
              </TabsContent>
              <TabsContent value="tests">
                <TestCaseCard
                  type="hidden"
                  title="Hidden Test Cases"
                  description="Used for judging submissions."
                  testCases={formData.testCases}
                  onTestCaseChange={changeTestCase}
                  onAddTestCase={addTestCase}
                  onRemoveTestCase={removeTestCase}
                  onFileLoad={setTestCaseFile}
                />
              </TabsContent>
            </Tabs>
            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                disabled={mutation.isLoading}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 disabled:opacity-50"
              >
                <Save className="mr-2 h-5 w-5" />
                {mutation.isLoading ? 'Creating…' : 'Create Problem'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProblemPage;

