import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // optional role required to access the route (e.g. 'admin')
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isLoggedIn, role, isLoading } = useAuth();

  if (isLoading) return null; // Wait for auth check to complete

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (requiredRole && role !== requiredRole) {
    // logged in but insufficient role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
