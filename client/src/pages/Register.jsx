import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../features/slices/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler.js";
import { setLoading } from "../features/slices/loaderSlice.js";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      dispatch(setLoading(true));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        const { email, password } = formData;

        const loggedInUser = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/login`,
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );

        if (loggedInUser?.data?.success) {
          dispatch(login(loggedInUser.data.data));
          navigate("/home");
          setFormData({
            fullName: "",
            username: "",
            email: "",
            password: "",
          });
        }
      }
    } catch (err) {
      handleApiError(err, setError);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 text-white relative overflow-hidden">

      {/* ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_60%)]" />

      <div className="relative w-full max-w-md rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Join and start building your channel
          </p>
        </div>

        {error && (
          <p className="mb-4 text-red-400 text-center text-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">

          <InputField
            placeholder="Full name"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
          />

          <InputField
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={onChange}
          />

          <InputField
            placeholder="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              required
              onChange={onChange}
              className="w-full rounded-lg bg-gray-950 px-3.5 py-2.5 text-sm border border-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition pr-10"
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-500/40 transition"
          >
            Create account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ type = "text", name, value, onChange, placeholder }) => (
  <input
    placeholder={placeholder}
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    required
    className="w-full rounded-lg bg-gray-950 px-3.5 py-2.5 text-sm border border-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition"
  />
);

export default Register;
