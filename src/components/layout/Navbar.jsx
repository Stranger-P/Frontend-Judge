import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code,
  Menu,
  User,
  LogOut,
  Settings,
  Trophy,
  Edit,
  Shield,
  ListTodo,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/userSlice';
import { ROUTES } from '../../utils/constant';

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-background">
      <nav className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-2">
          <Code className="h-7 w-7 text-white" />
          <span className="text-xl font-bold text-white">CodeJudge</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to={ROUTES.PROBLEMS}
            className="text-sm font-medium text-muted-foreground hover:text-white flex items-center gap-1"
          >
            <ListTodo className="h-4 w-4" />
            Problems
          </Link>
          {isAuthenticated && (
            <Link
              to={ROUTES.DASHBOARD}
              className="text-sm font-medium text-muted-foreground hover:text-white flex items-center gap-1"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Right: Auth/User */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium leading-none">{user?.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.DASHBOARD}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {(user?.role === 'problemSetter' || user?.role === 'admin') && (
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.CREATED_PROBLEM}>
                      <Edit className="mr-2 h-4 w-4" />
                      My Problems
                    </Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.ADMIN_USERS}>
                      <Shield className="mr-2 h-4 w-4" />
                      Manage Users
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" className="text-white hover:bg-muted">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button className="bg-blue-600 text-white hover:bg-blue-500">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted">
                <Menu className="h-5 w-5 text-gray-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background text-foreground">
              <div className="flex flex-col space-y-4 mt-6">
                <Link
                  to={ROUTES.PROBLEMS}
                  className="text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  <ListTodo className="h-4 w-4" />
                  Problems
                </Link>
                {isAuthenticated && (
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}
                {!isAuthenticated && (
                  <>
                    <Link to={ROUTES.LOGIN} className="text-sm font-medium hover:underline">
                      Sign In
                    </Link>
                    <Link to={ROUTES.SIGNUP} className="text-sm font-medium hover:underline">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
              <Separator className="my-4" />
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-destructive w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
