import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 gap-6">
      <h1 className="text-4xl md:text-5xl text-white font-semibold text-center">
        Welcome to Job Tracker
      </h1>
      <p className="text-gray-300 text-center max-w-3xl leading-relaxed">
        Keeping track of job applications can get messy. Job Tracker helps you
        organize where you have applied, track your progress, and stay focused
        on landing the right opportunity.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-4">
        <button
          className="hover:bg-green-700 cursor-pointer bg-green-600 text-white rounded-lg px-6 py-2 transition-colors duration-300"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="hover:bg-green-700 cursor-pointer bg-green-600 text-white rounded-lg px-6 py-2 transition-colors duration-300"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
