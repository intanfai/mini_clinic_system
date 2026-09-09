import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;