import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(
          "http://localhost:3000/api/jobApplication/dashboard",
          config,
        );
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDashboard();
  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading Intelligence...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Overview
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-white transition-colors font-medium cursor-pointer"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/getapplications")}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl cursor-pointer font-medium transition-all border border-gray-700"
          >
            View All
          </button>
        </div>
      </div>

      { /* Cards Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatBox
          label="Pending"
          count={data.pendingCount}
          color="text-yellow-500"
          border="border-yellow-500/20"
        />
        <StatBox
          label="Interviewing"
          count={data.interviewingCount}
          color="text-blue-500"
          border="border-blue-500/20"
        />
        <StatBox
          label="Accepted"
          count={data.acceptedCount}
          color="text-green-500"
          border="border-green-500/20"
        />
        <StatBox
          label="Rejected"
          count={data.rejectedCount}
          color="text-red-500"
          border="border-red-500/20"
        />
      </div>

      {/* Recent Applications */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
          <button
            onClick={() => navigate("/addjob")}
            className="text-green-500 hover:text-green-400 text-sm font-bold flex items-center cursor-pointer gap-2"
          >
            + ADD NEW
          </button>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-sm">
          {data.recentJobs.length > 0 ? (
            data.recentJobs.map((job) => (
              <div
                key={job._id}
                className="flex items-center justify-between p-6 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition"
              >
                <div>
                  <h3 className="text-lg font-bold">{job.companyName}</h3>
                  <p className="text-gray-400 text-sm">
                    {job.position} • {job.jobType}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${getStatusStyles(job.status)}`}
                  >
                    {job.status}
                  </span>
                  <p className="text-gray-500 text-xs hidden md:block">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-gray-500">
              No recent applications. Time to start applying!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for the Boxes
const StatBox = ({ label, count, color, border }) => (
  <div className={`bg-gray-900 p-8 rounded-3xl border ${border} shadow-2xl`}>
    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
      {label}
    </p>
    <p className={`text-5xl font-black ${color}`}>{count}</p>
  </div>
);

// Helper for status colors
const getStatusStyles = (status) => {
  switch (status) {
    case "accepted":
      return "text-green-400 border-green-900 bg-green-900/20";
    case "rejected":
      return "text-red-400 border-red-900 bg-red-900/20";
    case "interviewing":
      return "text-blue-400 border-blue-900 bg-blue-900/20";
    default:
      return "text-yellow-400 border-yellow-900 bg-yellow-900/20";
  }
};

export default Dashboard;
