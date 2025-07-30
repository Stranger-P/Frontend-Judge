import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "../../utils/constant";

const ProtectedRoute = ({ children, requireAuth = true, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  if(isAuthenticated && user?.role === 'admin') return children;
  console.log(user);
  console.log(isAuthenticated);
  // If the route requires authentication but the user is not logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // If the route doesn't require authentication (e.g., Login or Signup) but the user is logged in
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // If a specific role is required (e.g., problem-setter or admin)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // If all checks pass, render the protected page
  return children;
};

export default ProtectedRoute;