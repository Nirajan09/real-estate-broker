import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../validation/validationSchema";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      if (err.response) {
        const message = err.response.data.message || "Registration failed";

        if (message.toLowerCase().includes("name")) {
          setErrors({ name: message });
        } else if (
          message.toLowerCase().includes("email") ||
          message.toLowerCase().includes("user already exists")
        ) {
          setErrors({ email: message });
        } else if (message.toLowerCase().includes("password")) {
          setErrors({ password: message });
        } else {
          setErrors({ general: message });
        }
      } else if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          if (!fieldErrors[e.path]) {
            fieldErrors[e.path] = e.message;
          }
        });
        setErrors(fieldErrors);
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
          Create Account
        </h2>

        {/* General Error */}
        {errors.general && (
          <p className="text-red-500 mb-4 text-center">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className="block text-(--color-primary-dark) mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-(--color-secondary) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-(--color-primary-dark)">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-(--color-primary) font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;