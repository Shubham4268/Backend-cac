import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../features/slices/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler.js";
import { setLoading } from "../features/slices/loaderSlice.js";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      dispatch(setLoading(true))
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (response.data.success) {
        const { email, password } = formData;
        const loginData = { email, password };
        const loggedInUser = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/login`,
          loginData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { data: response } = loggedInUser || {};
        const { success } = response || false;
        const { data } = response || {};
        // const { accessToken } = data || "";

        if (success) {
          dispatch(login(data));
          navigate("/home");
          setFormData({ fullName: "", username: "", email: "", password: "" }); // Reset form state
        }
      }
    } catch (err) {
      handleApiError(err, setError);
    } finally{
      dispatch(setLoading(false))
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen ">
      <div className="mt-28 mb-12 shadow-lg w-1/3 p-5 bg-gray-800 rounded-lg text-white ">
        <h2 className="mt-6 mb-3 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form
          className="w-2/3 h-fit p-5 flex flex-col items-center mx-auto space-y-3 "
          onSubmit={onSubmit}
        >
          <InputField
            placeholder="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
          />
          <InputField
            placeholder="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
          />
          <InputField
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
          />
          
          <div className=" relative w-full">
            <input
              id="password"
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"} // Toggle type
              value={formData.password}
              required
              autoComplete="current-password"
              className="mt-2 block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              onChange={onChange}
            />
            {formData.password && ( // Show button only if password is not empty
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute mt-2 inset-y-0 right-2 flex items-center px-2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <BsEyeSlash /> : <BsEye /> }
              </button>
            )}
          </div>

          <div className="input-group flex flex-col w-full items-center">
            <button
              type="submit"
              className="mt-3 w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center text-sm/6 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ type, name, value, onChange, placeholder }) => (
  <div className="input-group flex flex-col w-full">
    <input
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="mt-2 block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    />
  </div>
);

export default Register;
