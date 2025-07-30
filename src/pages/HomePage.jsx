import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Trophy, Users, Zap, Code, Star, TrendingUp } from 'lucide-react';
import { Button } from './../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './../components/ui/card';
import Layout from './../components/layout/Layout';
import { ROUTES } from '../utils/constant';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <Layout>
      <div className="bg-background">
        {/* Hero Section */}
        <section className="relative px-4 py-20 md:py-32">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Master Your
              <span className="text-primary block mt-2">Coding Skills</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Join thousands of developers solving challenging problems, improving algorithms, 
              and preparing for technical interviews on our advanced online judge platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to={ROUTES.PROBLEMS}>
                  <Button size="lg" className="px-8 py-3">
                    Explore Problems
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to={ROUTES.SIGNUP}>
                    <Button size="lg" className="px-8 py-3">
                      Start Coding Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to={ROUTES.LOGIN}>
                    <Button size="lg" variant="outline" className="px-8 py-3">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          {/* Platform Capabilities Section */}
<section className="container mx-auto mt-24 text-center">
  <h2 className="text-3xl font-bold text-foreground mb-10">What Our Platform Offers</h2>

  <div className="grid md:grid-cols-3 gap-8 text-left">
    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <Code className="h-8 w-8 text-primary mb-3" />
        <CardTitle className="text-xl text-foreground">Role-Based Access Control</CardTitle>
        <CardDescription>
          Our platform supports multiple user roles – <strong>Admin</strong>, <strong>Problem Setter</strong>, and <strong>Regular User</strong>. Each role unlocks tailored capabilities and dashboard access.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <Star className="h-8 w-8 text-primary mb-3" />
        <CardTitle className="text-xl text-foreground">Problem Management</CardTitle>
        <CardDescription>
          Authenticated users (with proper roles) can <strong>add</strong>, <strong>edit</strong>, and <strong>delete coding problems</strong> with difficulty, tags, and rich descriptions.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <TrendingUp className="h-8 w-8 text-primary mb-3" />
        <CardTitle className="text-xl text-foreground">Live Code Execution</CardTitle>
        <CardDescription>
          Submit solutions in multiple languages. Our backend evaluates submissions in real-time and returns verdicts including <strong>time</strong>, <strong>memory</strong>, and <strong>AI feedback</strong>.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <Users className="h-8 w-8 text-primary mb-3" />
        <CardTitle className="text-xl text-foreground">Admin Role Control</CardTitle>
        <CardDescription>
          Platform admins can <strong>change user roles</strong> between User, Problem Setter, and Admin, enabling collaborative management and flexible access control.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <Trophy className="h-8 w-8 text-primary mb-3" />
        <CardTitle className="text-xl text-foreground">Submission Tracking</CardTitle>
        <CardDescription>
          Track your past submissions, view verdicts, execution metrics, and improve your solutions with each attempt.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <Zap className="h-8 w-8 text-primary mb-3" />
        <CardTitle className="text-xl text-foreground">AI-Based Code Review</CardTitle>
        <CardDescription>
          After submission, our system provides <strong>AI-generated feedback</strong> to help you improve code quality, efficiency, and readability.
        </CardDescription>
      </CardHeader>
    </Card>
  </div>
</section>


          {/* Features Section */}
          <div className="container mx-auto mt-24 grid md:grid-cols-3 gap-8">
            <Card className="leetcode-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-foreground text-xl">Competitive Programming</CardTitle>
                <CardDescription>
                  Solve problems from easy to expert level and compete with developers worldwide in real-time contests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="leetcode-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-foreground text-xl">Real-time Judging</CardTitle>
                <CardDescription>
                  Get instant feedback on your code submissions with our fast and accurate judge system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="leetcode-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-foreground text-xl">Community Driven</CardTitle>
                <CardDescription>
                  Discuss problems, read editorials, and contribute to the growing ecosystem with fellow coders.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
