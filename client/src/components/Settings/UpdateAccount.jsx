import axios from "axios";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleApiError } from "../../utils/errorHandler";
import { login } from "../../features/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../features/slices/loaderSlice.js";
import { toast, ToastContainer } from "react-toastify";
import { Camera } from "lucide-react";
import { validateEmail } from "../../utils/validation.js";

const InputField = ({ type = "text", name, value, onChange, placeholder, theme, error, maxLength }) => (
  <div className="w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      maxLength={maxLength}
      className={`
        w-full rounded-xl
        px-4 py-2.5 text-sm
        border transition
        focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40
        ${theme === "dark"
          ? "bg-gray-950/60 text-gray-100 border-white/10 placeholder:text-gray-500"
          : "bg-gray-50 text-gray-900 border-gray-300 placeholder:text-gray-400"
        }
        ${error ? "border-red-500 focus:border-red-500" : ""}
      `}
    />
    {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
  </div>
);

function UpdateAccount() {
  const response = useSelector((state) => state.user.userData);
  const { loggedInUser: user } = response || {};
  const collapsed = useSelector((state) => state.navbar.collapsed);
  const theme = useSelector((state) => state.theme.theme);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = (text) => toast(text);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isAccountChanged, setIsAccountChanged] = useState(false);

  const fileInputRef = useRef(null);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsAccountChanged(true);
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        dispatch(setLoading(true));
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/avatar`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.success) {
          setAvatar(response.data.data.avatar);
          dispatch(login(response.data.data));
          notify("Avatar updated successfully 📸");
        }
      } catch (err) {
        handleApiError(err, setError);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const onSubmitAccount = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const { fullName, email } = formData;
    const errors = {};

    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!validateEmail(email)) errors.email = "Please enter a valid email address";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/update-account`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        dispatch(login(response.data.data));
        notify("Account updated successfully ✨");
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    } catch (err) {
      handleApiError(err, setError);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"
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
            <h2 className={`text-3xl font-semibold tracking-tight bg-clip-text text-transparent ${theme === "dark" ? "bg-white" : "bg-gradient-to-r from-gray-900 to-gray-700"}`}>
              Update Your Account
            </h2>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm mt-2`}>
              Manage your profile information and avatar
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-center text-sm mb-4">
              {error}
            </p>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 blur opacity-30 group-hover:opacity-50 transition" />
              <img
                className="relative w-32 h-32 rounded-full object-cover border-4 border-gray-800 shadow-2xl"
                src={avatar || user?.avatar}
                alt={user?.fullName}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="
                  absolute bottom-0 right-0
                  p-2.5 rounded-full
                  bg-indigo-600 text-white
                  border-4 border-gray-800
                  hover:bg-indigo-500
                  shadow-lg
                  transition
                  group-hover:scale-110
                "
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Account Details Form */}
          <form onSubmit={onSubmitAccount} className="flex flex-col space-y-6">
            <div className="space-y-3">
              <InputField
                placeholder="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                theme={theme}
                maxLength={50}
                error={fieldErrors.fullName}
              />
              <InputField
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                theme={theme}
                maxLength={50}
                error={fieldErrors.email}
              />
            </div>

            {/* CTA */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className={`
                  relative overflow-hidden
                  px-8 py-2.5 rounded-xl
                  bg-indigo-600 text-white text-sm font-medium
                  shadow-lg 
                  hover:bg-indigo-500 
                  active:scale-[0.98]
                  transition
                  ${!isAccountChanged && "opacity-50 cursor-not-allowed"}
                `}
                disabled={!isAccountChanged}
              >
                Update Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAccount;
