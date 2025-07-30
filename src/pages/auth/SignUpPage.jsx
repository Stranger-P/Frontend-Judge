import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Code, Lock, Mail, User} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ROUTES } from '../../utils/constant';
import { useToast } from '@/hooks/use-toast';
import Layout from '../../components/layout/Layout';
import { SignUp } from '../../store/userSlice';
import { FcGoogle } from 'react-icons/fc';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {  status, error, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { toast } = useToast();
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match",
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
// NOTE: Your original logic is preserved as requested.
      dispatch(SignUp(formData)).finally(() => navigate('/dashboard'));
  }

  const handleGoogleSignup = () => {
      window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <Layout>
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
      <div className="text-center mb-6">
      <div className="flex items-center justify-center mb-4">
        <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
          <Code className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-foreground">
        CodeJudge
      </h1>
      <p className="text-muted-foreground mt-2">Start your coding journey today</p>
    </div>

        <Card className="bg-slate-900/50 border border-slate-800 backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-foreground">Create an Account</CardTitle>
            <CardDescription>
              Join thousands of developers solving challenges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required className="pl-10 h-11 bg-slate-800 border-slate-700 placeholder:text-muted-foreground focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="username" name="username" type="text" placeholder="Choose a username" value={formData.username} onChange={handleChange} required className="pl-10 h-11 bg-slate-800 border-slate-700 placeholder:text-muted-foreground focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={formData.password} onChange={handleChange} required className="pl-10 pr-10 h-11 bg-slate-800 border-slate-700 placeholder:text-muted-foreground focus:border-primary" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required className="pl-10 pr-10 h-11 bg-slate-800 border-slate-700 placeholder:text-muted-foreground focus:border-primary" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" disabled={isLoading}>
                {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : 'Create Account'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full h-11 border-slate-700 bg-transparent hover:bg-slate-800"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </Layout>
  );
};

export default SignupPage;