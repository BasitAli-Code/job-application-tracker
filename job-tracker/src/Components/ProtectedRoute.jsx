import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // If there is no user, redirect to login page
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render the children components (the page)
  return children;
};

export default ProtectedRoute;
