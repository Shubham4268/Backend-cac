import axios from "axios";
import { useState } from "react";
import { handleApiError } from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

function ChangePassword() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.navbar.collapsed);
  const theme = useSelector((state) => state.theme.theme);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const notify = (text) => toast(text);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNavigation = () => {
    setTimeout(() => {
      navigate("/home");
    }, 5000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/change-password`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        setFormData({ oldPassword: "", newPassword: "" });
        notify("Password changed successfully 🔒");
        handleNavigation();
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-all duration-300 ${
      collapsed ? "ml-16" : "ml-60"
    } ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <div className="relative flex items-center justify-center min-h-screen px-6 py-24">
        <ToastContainer />

        {/* Card */}
        <div
          className={`
            w-full max-w-xl
            rounded-2xl
            border backdrop-blur-3xl
            px-8 py-8
            ${theme === "dark" 
              ? "bg-slate-800 border-white/10" 
              : "bg-white border-gray-200 shadow-xl"
            }
          `}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-semibold tracking-tight bg-clip-text text-transparent ${
              theme === "dark" 
                ? "bg-white" 
                : "bg-gradient-to-r from-gray-900 to-gray-700"
            }`}>
              Change Password
            </h2>
            <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Update your account password for better security
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-center text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="flex flex-col space-y-6">
            {/* Password fields */}
            <div className="space-y-3">
              <InputField
                placeholder="Current Password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={onChange}
                theme={theme}
              />
              <InputField
                placeholder="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={onChange}
                theme={theme}
              />
            </div>

            {/* CTA */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="
                  relative overflow-hidden
                  px-8 py-2.5 rounded-xl
                  bg-indigo-600 text-white text-sm font-medium
                  shadow-lg 
                  hover:bg-indigo-500 
                  active:scale-[0.98]
                  transition
                "
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ name, value, onChange, placeholder, theme }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="w-full relative">
      <input
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        className={`
          w-full rounded-xl
          px-4 py-2.5 text-sm pr-10
          border
          focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40
          transition
          ${theme === "dark"
            ? "bg-gray-950/60 text-gray-100 border-white/10 placeholder:text-gray-500"
            : "bg-gray-50 text-gray-900 border-gray-300 placeholder:text-gray-400"
          }
        `}
      />
      {value && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200 transition"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default ChangePassword;
