import { useEffect } from "react";
import { Routes, Route} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CreateProblemPage from "./pages/problems/createProblem/CreateProblemPage";
import CreatedProblemPage from "./pages/problems/createProblem/ProblemSetterProblem";
import ProblemsPage from "./pages/problems/ProblemsPage";
import ProblemViewPage from "./pages/problems/ProblemViewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/dashboard/Dashboard";
import { ROUTES } from "./utils/constant";
import { getProfile } from "./store/userSlice";

const App = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.user);
  useEffect(() => {
      dispatch(getProfile());
  }, [dispatch]);
  // console.log(status);
  if(status === "loading" || status === "idle") return null;
return (

    <TooltipProvider>
      <Toaster />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute requireAuth={true}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LOGIN}
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SIGNUP}
            element={
              <ProtectedRoute requireAuth={false}>
                <SignupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CREATE_PROBLEM}
            element={
              <ProtectedRoute requireAuth={true} requiredRole="problem-setter">
                <CreateProblemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CREATED_PROBLEM}
            element={
              <ProtectedRoute requireAuth={true} requiredRole="problem-setter">
                <CreatedProblemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROBLEMS}
            element={<ProblemsPage />}
          />
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <ProtectedRoute requireAuth={true} requiredRole="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/problems/:id" element={<ProblemViewPage />} />
        </Routes>
    </TooltipProvider>
   );
};
export default App;
