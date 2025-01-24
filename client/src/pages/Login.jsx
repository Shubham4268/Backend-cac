import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler";
import axios from "axios";
import { login } from "../features/slices/authSlice.js";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/slices/loaderSlice.js";
import { BsEye, BsEyeSlash } from "react-icons/bs";
console.log(import.meta.env.VITE_BACKEND_BASEURL);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      dispatch(setLoading(true));

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
          body: JSON.stringify(formData), // Send the form data as JSON
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const responseData = await response.json();
      const { success, data } = responseData || {};

      if (success) {
        dispatch(login(data)); // Dispatch action with user data
        navigate("/home"); // Redirect on successful login
        setFormData({ email: "", password: "" }); // Reset form state
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="mt-10 h-screen w-full flex">
        <div className="w-2/5 m-auto flex-col justify-center rounded-lg bg-gray-800">
          <h2 className="mt-12 mb-6 text-center text-2xl/9 font-bold tracking-tight text-white">
            Log in to your account
          </h2>
          {error && (
            <p className="mb-4 text-red-500 text-center text-sm">{error}</p>
          )}
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={onSubmit} className="space-y-6 w-2/3 m-auto">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-white"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={onChange}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-row items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-white"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} // Toggle type
                    value={formData.password}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={onChange}
                  />
                  {formData.password && ( // Show button only if password is not empty
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Log in
                </button>
              </div>
            </form>

            <p className="m-10 text-center text-sm/6 text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
