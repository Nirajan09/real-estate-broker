import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setErrors({ general: "All fields are required" });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Invalid email format" });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        const message = err.response.data.message || "Login failed";

        if (
          message.toLowerCase().includes("email") ||
          message.toLowerCase().includes("credentials")
        ) {
          setErrors({ email: message });
        } else if (message.toLowerCase().includes("password")) {
          setErrors({ password: message });
        } else {
          setErrors({ general: message });
        }
      } else {
        setErrors({ general: "Something went wrong. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-r from-(--color-primary-dark) to-(--color-primary)">
      
      <div className="max-w-md w-full bg-(--color-accent-light) rounded-2xl shadow-xl p-8">
        
        <h2 className="text-3xl font-bold mb-6 text-center text-(--color-primary-dark)">
          Welcome Back
        </h2>

        {/* General Error */}
        {errors.general && (
          <p className="text-red-500 mb-4 text-center">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-(--color-primary-dark) mb-1 font-medium">
              Email
            </label>

            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-(--color-secondary) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-(--color-primary-dark) mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-(--color-secondary) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--color-primary-dark) text-(--color-accent-light) font-semibold py-2.5 rounded-lg hover:bg-(--color-primary) transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-(--color-primary-dark)">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-(--color-primary) font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;