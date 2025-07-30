import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Code, Trophy, Target, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import SubmissionHeatmap from './heatMap';
import CodeViewerModal from './CodeViewerModal';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Recent Submission Component
const RecentSubmission = ({ submission, handleViewCode, getStatusColor }) => (
  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
    <div className="flex-1">
      <div className="font-medium text-foreground">{submission.problemId.title}</div>
      <div className="text-sm text-muted-foreground">
        {submission.language} • {new Date(submission.submittedAt).toLocaleString()}
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <div className={`text-sm font-medium ${getStatusColor(submission.status)}`}>
          {submission.status}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewCode(submission)}
        className="text-muted-foreground hover:text-foreground"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

// Recommended Problem Component
const RecommendedProblem = ({ problem, getDifficultyColor }) => (
  <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
    <div className="flex-1">
      <div className="font-medium text-foreground">{problem.title}</div>
      <div className="text-sm text-muted-foreground">{problem.category}</div>
    </div>
    <div className="flex items-center space-x-3">
      <Badge className={`${getDifficultyColor(problem.difficulty)} bg-transparent border-current`}>
        {problem.difficulty}
      </Badge>
      <div className="text-sm text-muted-foreground">{problem.acceptanceRate}%</div>
    </div>
  </div>
);

// Pagination Controls Component
const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="flex items-center space-x-1">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="h-8 w-8 p-0"
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <span className="text-xs text-muted-foreground">
      {currentPage}/{totalPages}
    </span>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="h-8 w-8 p-0"
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [currentSubmissionPage, setCurrentSubmissionPage] = useState(1);
  const [currentRecommendationPage, setCurrentRecommendationPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [stats, setStats] = useState({
    problemsSolved: 0,
    difficultyBreakdown: { Easy: 0, Medium: 0, Hard: 0 },
    acceptanceRate: '0.0',
    currentStreak: 0,
    maxStreak: 0,
    submissions: [],
    heatmapData: {},
    totalSubmissions: 0,
  });
  const [recommendedProblems, setRecommendedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const itemsPerPage = 5;

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const statsResponse = await axios.get(`${BASE_URL}/api/dashboard/stats`, { withCredentials: true });
      setStats({
        ...statsResponse.data,
        totalSubmissions: Object.values(statsResponse.data.heatmapData).reduce((sum, count) => sum + count, 0),
      });

      // Fetch recommended problems
      const recommendedResponse = await axios.get(`${BASE_URL}/api/dashboard/recommended`, { withCredentials: true });
      setRecommendedProblems(recommendedResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentYear]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setError('Please log in to view dashboard');
      setLoading(false);
    }
  }, [fetchData, isAuthenticated, user?._id]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'difficulty-easy';
      case 'medium':
        return 'difficulty-medium';
      case 'hard':
        return 'difficulty-hard';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Accepted') return 'status-accepted';
    if (status === 'Time Limit Exceeded') return 'status-timeout';
    return 'status-wrong';
  };

  const handleViewCode = (submission) => {
    setSelectedSubmission(submission);
    setIsCodeModalOpen(true);
  };

  const getTotalPages = (items) => Math.ceil(items.length / itemsPerPage);

  const getCurrentSubmissions = () => {
    const start = (currentSubmissionPage - 1) * itemsPerPage;
    return stats.submissions.slice(start, start + itemsPerPage);
  };

  const getCurrentRecommendations = () => {
    const start = (currentRecommendationPage - 1) * itemsPerPage;
    return recommendedProblems.slice(start, start + itemsPerPage);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">
  <span className="text-gray-400">Loading…</span>
</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track your coding progress and achievements</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="leetcode-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Problems Solved
                </CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.problemsSolved}</div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full difficulty-easy bg-current"></div>
                    <span className="text-xs text-muted-foreground">{stats.difficultyBreakdown.easy} Easy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full difficulty-medium bg-current"></div>
                    <span className="text-xs text-muted-foreground">{stats.difficultyBreakdown.medium} Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full difficulty-hard bg-current"></div>
                    <span className="text-xs text-muted-foreground">{stats.difficultyBreakdown.hard} Hard</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="leetcode-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Acceptance Rate
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.acceptanceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-400">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="leetcode-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.currentStreak} days</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-400">Keep it up!</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Submission Heatmap */}
          <div className="mb-8">
            <SubmissionHeatmap
              heatmapData={stats.heatmapData}
              totalSubmissions={stats.totalSubmissions}
              maxStreak={stats.maxStreak}
              currentStreak={stats.currentStreak}
              setCurrentYear={setCurrentYear}
              currentYear={currentYear}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Submissions */}
            <Card className="leetcode-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Recent Submissions</CardTitle>
                  <PaginationControls
                    currentPage={currentSubmissionPage}
                    totalPages={getTotalPages(stats.submissions)}
                    setCurrentPage={setCurrentSubmissionPage}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getCurrentSubmissions().map((submission) => (
                    <RecentSubmission
                      key={submission._id}
                      submission={submission}
                      handleViewCode={handleViewCode}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Problems */}
            <Card className="leetcode-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Recommended Problems</CardTitle>
                  <PaginationControls
                    currentPage={currentRecommendationPage}
                    totalPages={getTotalPages(recommendedProblems)}
                    setCurrentPage={setCurrentRecommendationPage}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getCurrentRecommendations().map((problem) => (
                    <RecommendedProblem
                      key={problem._id}
                      problem={problem}
                      getDifficultyColor={getDifficultyColor}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CodeViewerModal
        submission={selectedSubmission}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </Layout>
  );
};

export default DashboardPage;