import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { CheckCircle, Eye, FilePlus } from 'lucide-react';
import Layout from '../../../components/layout/Layout';
import { ROUTES } from '../../../utils/constant';

const ProblemSuccessCard = ({ problem, onReset }) => (
  <Layout>
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Card className="w-full max-w-2xl border-gray-600 bg-gray-800/80 text-white">
        <CardHeader className="text-center items-center">
          <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-100">Problem Created!</CardTitle>
          <CardDescription className="text-gray-400 pt-2">Your new challenge is now ready for the community.</CardDescription>
        </CardHeader>
        <div className="flex justify-center gap-4 p-6">
          {/* <Link to={ROUTES.PROBLEM_DETAIL(problem._id || 'new-id')}>
            <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
              <Eye className="mr-2 h-4 w-4" /> View Problem
            </Button>
          </Link> */}
          <Button onClick={onReset} className="bg-blue-600 hover:bg-blue-700 text-white">
            <FilePlus className="mr-2 h-4 w-4" /> Create Another
          </Button>
        </div>
      </Card>
    </div>
  </Layout>
);

export default ProblemSuccessCard;