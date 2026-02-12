import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // If user IS logged in, don't let them see Login/Signup, send to Dashboard
  if (user && user.token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
