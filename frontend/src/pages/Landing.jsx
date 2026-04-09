import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-linear-to-r from-(--color-primary-dark) to-(--color-primary)"
    >
      <h1 className="text-5xl font-bold text-(--color-accent-light) mb-4">
        Welcome to Real Estate Portal
      </h1>

      <p className="text-(--color-secondary) text-lg mb-8 max-w-xl">
        Discover your dream property and save your favorites effortlessly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Login Button */}
        <Link
          to="/login"
          className="bg-(--color-accent-light) text-(--color-primary-dark) font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#f0f0c5 transition-colors"
        >
          Login
        </Link>

        {/* Register Button */}
        <Link
          to="/register"
          className="bg-transparent border-2 border-(--color-accent-light) text-(--color-accent-light) font-semibold px-6 py-3 rounded-lg hover:bg-(--color-accent-light) hover:text-(--color-primary-dark) transition-colors"
        >
          Register
        </Link>

      </div>
    </div>
  );
};

export default Landing;
