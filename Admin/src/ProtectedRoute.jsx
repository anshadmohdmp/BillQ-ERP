import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ⏳ wait until auth is restored from localStorage
  if (loading) return null; // or a spinner

  // 🔒 not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ logged in
  return children;
};

export default ProtectedRoute;
