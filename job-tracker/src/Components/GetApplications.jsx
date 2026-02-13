import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GetApplications() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobApplication`,
          config,
        );
        setJobs(res.data);
      } catch (err) {
        alert("Failed to fetch jobs");
        console.log(err);
      }
    };
    fetchJobs();
  }, []);

  // Search by Company or Position
  const filteredJobs = jobs.filter(
    (job) =>
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sorting Logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "alpha") return a.companyName.localeCompare(b.companyName);
    if (sortBy === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt); // Default: latest
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/jobApplication/${id}`,
          config,
        );
        setJobs(jobs.filter((j) => j._id !== id));
        alert("Job Deleted successfully");
      } catch (err) {
        alert("Delete failed");
        console.log(err);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">All Applications</h1>
          <button
            onClick={() => navigate("/addjob")}
            className="bg-green-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-500"
          >
            + New Job
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by company or role..."
            className="flex-1 p-4 rounded-xl bg-gray-900 border border-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 outline-none"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alpha">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Table/List of Jobs */}
        <div className="grid gap-4">
          {sortedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-center hover:border-gray-600 transition"
            >
              <div>
                <h3 className="text-xl font-bold">{job.companyName}</h3>
                <p className="text-gray-400">
                  {job.position} • {job.location}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Applied on: {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm border ${getStatusStyles(job.status)} uppercase`}
                >
                  {job.status}
                </span>

                {/* Added Update Button */}
                <button
                  onClick={() => navigate(`/editjob/${job._id}`)}
                  className="cursor-pointer text-blue-500 hover:text-blue-400 font-bold transition"
                >
                  Update
                </button>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="cursor-pointer text-red-500 hover:text-red-400 font-bold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
