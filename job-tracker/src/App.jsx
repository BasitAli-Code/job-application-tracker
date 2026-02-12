import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import GetApplications from "./Components/GetApplications";
import Dashboard from "./Components/Dashboard";
import AddJob from "./Components/AddJob";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/getapplications"
            element={
              <ProtectedRoute>
                <GetApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addjob"
            element={
              <ProtectedRoute>
                <AddJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editjob/:id"
            element={
              <ProtectedRoute>
                <AddJob />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
