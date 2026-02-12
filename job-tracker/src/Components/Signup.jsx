import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    backend: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, backend: "", [name]: "" }));
  };

  const validateForm = () => {
    let tempErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      backend: "",
    };
    let isValid = true;

    if (!formData.email.includes("@gmail.com")) {
      tempErrors.email = "Please enter a valid @gmail.com address";
      isValid = false;
    }

    const alphaCount = (formData.password.match(/[a-zA-Z]/g) || []).length;
    const numCount = (formData.password.match(/[0-9]/g) || []).length;

    if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (alphaCount < 5) {
      tempErrors.password = "Password must have at least 5 alphabets";
      isValid = false;
    } else if (numCount < 2) {
      tempErrors.password = "Password must have at least 2 numbers";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match!";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:3000/api/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        alert("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setErrors((prev) => ({ ...prev, backend: message }));
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-md">
          Create Your Account
        </h2>
        <p className="text-gray-400 text-center mb-7">
          Fill in your details to get started
        </p>

        {/* General Login Error (from Backend) */}
        {errors.backend && (
          <p className="text-red-400 text-sm text-center mb-3">
            {errors.backend}
          </p>
        )}

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

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
            {errors.email && (
              <p className="text-red-400 text-[14px] m-0 ml-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`p-4 rounded-xl bg-gray-800 text-white border ${errors.password ? "border-red-500" : "border-gray-700"} focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {errors.password && (
              <p className="text-red-400 text-[14px] m-0 ml-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`p-4 rounded-xl bg-gray-800 text-white border ${errors.confirmPassword ? "border-red-500" : "border-gray-700"} focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-[14px] m-0 ml-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-green-500 hover:cursor-pointer"
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-700 text-white font-semibold py-3 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-600 hover:cursor-pointer"
          >
            Back
          </button>
        </form>

        {/* Restored Login Link Section */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <span
            className="text-green-500 hover:text-green-400 cursor-pointer font-medium"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}
