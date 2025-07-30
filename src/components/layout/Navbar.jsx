import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Menu, User, LogOut, Settings, Trophy, Edit, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/userSlice';
import { ROUTES } from '../../utils/constant';

// NOTE: All logic, including Redux hooks and handlers, remains UNCHANGED.
// Only the className props and component styles have been updated for theme consistency.

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch(logoutUser()).finally(() => navigate(ROUTES.HOME));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-[#282828]">
      <nav className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-2">
          <Code className="h-7 w-7 text-white" />
          <span className="text-xl font-bold text-white">CodeJudge</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to={ROUTES.PROBLEMS}
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Problems
          </Link>
          {isAuthenticated && (
            <Link
              to={ROUTES.DASHBOARD}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side: Auth Buttons or User Menu */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-800">
                  <User className="h-5 w-5 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#282828] border-gray-700 text-gray-300" align="end">
                <div className="flex items-center justify-start gap-3 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-white">{user?.username}</p>
                    <p className="w-[200px] truncate text-sm text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                {/* <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-700/80 focus:text-white">
                  <Link to={ROUTES.PROFILE}>
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    Profile
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-700/80 focus:text-white">
                  <Link to={ROUTES.DASHBOARD}>
                    <Trophy className="mr-2 h-4 w-4 text-gray-400" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {(user?.role === 'problemSetter' || user?.role === 'admin') && (
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-700/80 focus:text-white">
                    <Link to={ROUTES.CREATED_PROBLEM}>
                      <Edit className="mr-2 h-4 w-4 text-gray-400" />
                      My Problems
                    </Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-700/80 focus:text-white">
                    <Link to={ROUTES.ADMIN_USERS}>
                      <Shield className="mr-2 h-4 w-4 text-gray-400" />
                      Manage Users
                    </Link>
                  </DropdownMenuItem>
                )}
                {/* <DropdownMenuItem className="cursor-pointer focus:bg-gray-700/80 focus:text-white">
                  <Settings className="mr-2 h-4 w-4 text-gray-400" />
                  Settings
                </DropdownMenuItem> */}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:bg-red-900/50 focus:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" className="hover:bg-gray-800 text-gray-300">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button className="bg-blue-600 text-white hover:bg-blue-500">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu (Hamburger) */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                  <Menu className="h-5 w-5 text-gray-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#282828] border-gray-700 text-gray-300" align="end">
                <DropdownMenuItem asChild className="focus:bg-gray-700/80 focus:text-white">
                  <Link to={ROUTES.PROBLEMS}>Problems</Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <DropdownMenuItem asChild className="focus:bg-gray-700/80 focus:text-white">
                    <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-gray-700" />
                {!isAuthenticated && (
                  <>
                    <DropdownMenuItem asChild className="focus:bg-gray-700/80 focus:text-white">
                       <Link to={ROUTES.LOGIN}>Sign In</Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild className="focus:bg-gray-700/80 focus:text-white">
                       <Link to={ROUTES.SIGNUP}>Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;