import axios from "axios";
import { useState } from "react";
import { handleApiError } from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";
import { toast, ToastContainer } from "react-toastify";
import { BsEye, BsEyeSlash } from "react-icons/bs";

function ChangePassword() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const notify = (text) => toast(text);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNavigation = () => {
    // Navigate to "/settings" after 3 seconds
    setTimeout(() => {
      navigate("/home");
    }, 5000); // 3000ms = 3 seconds
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
        handleNavigation();
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      notify("Password changed successfully")
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="mt-28 mb-12 shadow-lg w-1/3 p-5 bg-gray-800 rounded-lg text-white">
      <ToastContainer />
        <h2 className="mt-6 mb-3 text-center text-2xl/9 font-bold tracking-tight text-white">
          Change Password
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form
          className="w-2/3 h-fit p-5 flex flex-col items-center mx-auto space-y-3"
          onSubmit={onSubmit}
        >
          <InputField
            placeholder="Current Password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={onChange}
          />
          <InputField
            placeholder="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={onChange}
          />

          <div className="input-group flex flex-col w-full items-center">
            <button
              type="submit"
              className="mt-3 w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const InputField = ({ name, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="input-group flex flex-col w-full relative">
      <input
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="mt-2 block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />
      {value && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute mt-2 inset-y-0 right-2 flex items-center px-2 text-gray-400 hover:text-gray-200"
        >
          {showPassword ? <BsEyeSlash /> : <BsEye /> }
        </button>
      )}
    </div>
  );
};

export default ChangePassword;
