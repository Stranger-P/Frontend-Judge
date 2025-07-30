import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const { toast } = useToast();

  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      
    //   toast({
    //     title: "Login Successful",
    //     description: response.message,
    //   });
    // } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: "Login Failed",
    //     description: error.message || "An error occurred during login",
    //   });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data) => {
    try {
      setIsLoading(true);
      const response = await authService.signup(data);
      setUser(response.user);
      
    //   toast({
    //     title: "Account Created",
    //     description: response.message,
    //   });
    // } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: "Signup Failed",
    //     description: error.message || "An error occurred during signup",
    //   });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      
      // toast({
      //   title: "Logged Out",
      //   description: "You have been successfully logged out",
      // });
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Logout Error",
      //   description: error.message || "An error occurred during logout",
      // });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;