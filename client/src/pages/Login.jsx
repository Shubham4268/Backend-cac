import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler";
import axios from "axios";
import { login } from "../features/slices/authSlice.js";
import { useDispatch } from "react-redux";

const Login = () => {
  const [formData, setFormData] = useState({
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
    setError(null);

    try {
      const loggedInUser = await axios.post(
        "http://localhost:8000/api/v1/users/login", 
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (loggedInUser.data.success) {
        dispatch(login(loggedInUser.data)); // Adjust based on API response structure
        console.log(loggedInUser.data);
        navigate("/home");
        setFormData({ fullName: "", username: "", email: "", password: "" }); // Reset form state
      }
    } catch (error) {
      handleApiError(error, setError);
    }
  };
  return (
    <>
      <div className="h-screen w-screen flex ">
        <div className="w-2/5 m-auto flex-col justify-center rounded-lg bg-gray-800 ">
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
                    className="block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={onChange}
                  />
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
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default Login;
