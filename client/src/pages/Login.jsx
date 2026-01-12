import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler";
import { login } from "../features/slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../features/slices/loaderSlice.js";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      dispatch(setLoading(true));

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const responseData = await response.json();
      const { success, data } = responseData || {};

      if (success) {
        dispatch(login(data));
        navigate("/home");
        setFormData({ email: "", password: "" });
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-950 text-white" : "bg-gradient-to-b from-gray-50 to-white text-gray-900"}`}>

      {/* ambient background glow */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top,${theme === "dark" ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)"},transparent_60%)]`} />

      <div className={`relative w-full max-w-md rounded-2xl backdrop-blur-xl border shadow-2xl p-8 ${theme === "dark" ? "bg-gray-900/80 border-white/10" : "bg-white/80 border-gray-200"}`}>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold tracking-tight bg-clip-text text-transparent ${theme === "dark" ? "bg-gradient-to-r from-white to-gray-400" : "bg-gradient-to-r from-gray-900 to-gray-700"}`}>
            Welcome back
          </h2>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm mt-1`}>
            Log in to continue to your account
          </p>
        </div>

        {error && (
          <p className="mb-4 text-red-400 text-center text-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={onChange}
              placeholder="you@example.com"
              className={`w-full rounded-lg px-3.5 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition ${theme === "dark" ? "bg-gray-950 border-white/10 placeholder:text-gray-500" : "bg-gray-50 border-gray-300 placeholder:text-gray-400"}`}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Password
              </label>
              <span className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={onChange}
                placeholder="••••••••"
                className={`w-full rounded-lg px-3.5 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition pr-10 ${theme === "dark" ? "bg-gray-950 border-white/10 placeholder:text-gray-500" : "bg-gray-50 border-gray-300 placeholder:text-gray-400"}`}
              />

              {formData.password && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-500/40 transition"
          >
            Log in
          </button>
        </form>

        {/* Footer */}
        <p className={`mt-8 text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
