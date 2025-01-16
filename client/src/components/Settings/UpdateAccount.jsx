import axios from "axios";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleApiError } from "../../utils/errorHandler";
import { login } from "../../features/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../features/slices/loaderSlice.js";
import { toast, ToastContainer } from "react-toastify";

function UpdateAccount() {
  const response = useSelector((state) => state.user.userData);
  const { loggedInUser: user } = response || {};
  const [error, setError] = useState(null);
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

  // Handle changes in the form fields
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsAccountChanged(true); // Enable the account submit button when fields are changed
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
        }
      } catch (err) {
        handleApiError(err, setError);
      } finally {
        dispatch(setLoading(false));
        notify("Avatar Updated successfully");
      }
    }
  };

  const onSubmitAccount = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      dispatch(setLoading(true));
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/update-account`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        dispatch(login(response.data.data));
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    } catch (err) {
      handleApiError(err, setError);
    } finally {
      notify("Account Updated successfully");
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="mt-28 mb-12 shadow-lg w-1/3 p-5 bg-gray-800 rounded-lg text-white">
        {error && <p className="text-red-500 text-center">{error}</p>}
      <ToastContainer/>
        <h2 className="mt-3 mb-3 text-center text-2xl font-bold">
          Update Your Account
        </h2>

        {/* Avatar Section */}
        <form className="flex flex-col items-center mx-auto my-5">
          <div className="relative">
            <img
              className="w-28 h-28 z-10 rounded-full object-cover"
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
              className="absolute p-1 z-10 bottom-0 right-0 border border-gray-600 rounded-full bg-gray-800 hover:bg-gray-900 hover:shadow-lg"
            >
              ✏️
            </button>
          </div>
        </form>

        {/* Account Details Section */}
        <form
          className="w-3/5 flex flex-col items-center mx-auto space-y-3"
          onSubmit={onSubmitAccount}
        >
          <InputField
            placeholder="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
          />
          <InputField
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
          />

          <button
            type="submit"
            className={` w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 ${
              !isAccountChanged && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isAccountChanged}
          >
            Update Account
          </button>
        </form>
      </div>
    </div>
  );
}

const InputField = ({ type, name, value, onChange, placeholder }) => (
  <div className="input-group flex flex-col w-full">
    <input
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="mb-3 block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    />
  </div>
);

export default UpdateAccount;
