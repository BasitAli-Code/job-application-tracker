import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    login: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({ email: "", login: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.includes("@gmail.com")) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter a valid @gmail.com address",
      }));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        formData,
      );

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        alert("Logged in successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials";
      setErrors((prev) => ({ ...prev, login: message }));
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Login to Job Tracker
        </h2>
        <p className="text-gray-400 text-center mb-7">
          Enter your credentials to access your account
        </p>

        {/* General Login Error (from Backend) */}
        {errors.login && (
          <p className="text-red-400 text-sm text-center mb-3">
            {errors.login}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`p-4 rounded-xl bg-gray-800 text-white border ${errors.email ? "border-red-500" : "border-gray-700"} focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {/* Error Paragraph */}
            {errors.email && (
              <p className="text-red-400 text-xs ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-green-500 cursor-pointer"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-700 text-white font-semibold py-3 rounded-xl hover:bg-gray-600 transition duration-300 cursor-pointer"
          >
            Back
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <span
            className="text-green-500 hover:text-green-400 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}
