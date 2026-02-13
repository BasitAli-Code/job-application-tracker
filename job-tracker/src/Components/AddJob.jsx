import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AddJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    status: "pending",
    jobType: "remote",
    location: "",
  });

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };

          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/jobApplication/${id}`,
            config,
          );

          const job = res.data;

          setFormData({
            companyName: job.companyName,
            position: job.position,
            status: job.status,
            jobType: job.jobType,
            location: job.location,
          });
        } catch (error) {
          console.log(error);
          alert("Could not find that application.");
          navigate("/getapplications");
        }
      };

      fetchData();
    }
  }, [id, navigate]);

  const { companyName, position, status, jobType, location } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      //update case
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/jobApplication/${id}`,
          formData,
          config,
        );

        alert("Application Updated!");
        navigate("/getapplications");
      } else {
        //add case
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/jobApplication/`,
          formData,
          config,
        );

        alert("Application Added!");
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add application");
    }
  };

  return (
    <>
      <div>
        <button
          onClick={() => navigate("/getapplications")}
          className="mt-5 ml-7 cursor-pointer text-gray-400 hover:text-white"
        >
          ← Back
        </button>
      </div>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {id ? "Update Application" : "New Application"}
          </h2>

          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5">
            {/* Company Name */}
            <input
              type="text"
              name="companyName"
              placeholder="Company Name (e.g. Google)"
              value={companyName}
              onChange={onChange}
              className="p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />

            {/* Position */}
            <input
              type="text"
              name="position"
              placeholder="Position (e.g. React Developer)"
              value={position}
              onChange={onChange}
              className="p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Status Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-sm ml-1">Status</label>
                <select
                  name="status"
                  value={status}
                  onChange={onChange}
                  className="p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Job Type Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-sm ml-1">Job Type</label>
                <select
                  name="jobType"
                  value={jobType}
                  onChange={onChange}
                  className="p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="remote">Remote</option>
                  <option value="on site">On-Site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <input
              type="text"
              name="location"
              placeholder="Location (City or 'Remote')"
              value={location}
              onChange={onChange}
              className="p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-500 transition duration-300 shadow-lg cursor-pointer"
              >
                {id ? "Update Application" : "Add Application"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/getapplications")}
                className="px-6 bg-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-600 transition duration-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
