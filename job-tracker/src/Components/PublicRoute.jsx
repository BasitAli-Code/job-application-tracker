import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
