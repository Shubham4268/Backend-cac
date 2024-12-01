import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../features/slices/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler.js";

const Register = () => {
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
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        dispatch(login(response.data)); // Adjust based on API response structure
        console.log(response.data);
        navigate("/home");
        setFormData({ fullName: "", username: "", email: "", password: "" }); // Reset form state
      }
    } catch (err) {      
      handleApiError(err,setError)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="shadow-lg w-2/5 p-5 bg-gray-800 rounded-lg text-white">
      <h2 className="mt-12 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form
          className="w-2/3 h-2/3 p-5 flex flex-col items-center mx-auto space-y-5"
          onSubmit={onSubmit}
        >
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
          />
          <InputField
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
          />

          <div className="input-group flex flex-col w-full">
            <button
              type="submit"
              className="w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>
        <p className="m-10 text-center text-sm/6 text-gray-500">
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

const InputField = ({ label, type, name, value, onChange }) => (
  <div className="input-group flex flex-col w-full">
    <label htmlFor={name} className="input-label">
      {label}
    </label>
    <input
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
