import { useState } from "react";
import { useDispatch } from "react-redux";
import {login} from "../features/slices/authSlice.js"

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:8000/api/v1/users/register",
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log(response);
    
    
    const json = await response.json();
    
    dispatch(login(json))
    
    if (json.success) {
      alert("User registered successfully...");
      e.target.reset();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-slate-100">
      <div className="shadow-lg w-1/2 p-5 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-center">Register User</h1>
        <form
          className="w-2/3 h-2/3 p-5 flex flex-col items-center mx-auto space-y-5"
          onSubmit={onSubmit}
        >
          <div className="input-group flex flex-col w-full">
            <label htmlFor="name" className="input-label">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              className="border outline-none border-slate-400 px-2 py-1 focus:border-blue-500"
              onChange={onChange}
            />
          </div>

          <div className="input-group flex flex-col w-full">
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="border outline-none border-slate-400 px-2 py-1 focus:border-blue-500"
              onChange={onChange}
            />
          </div>

          <div className="input-group flex flex-col w-full">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="border outline-none border-slate-400 px-2 py-1 focus:border-blue-500"
              onChange={onChange}
            />
          </div>

          <div className="input-group flex flex-col w-full">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="border outline-none border-slate-400 px-2 py-1 focus:border-blue-500"
              onChange={onChange}
            />
          </div>

          <button className="bg-blue-500 px-10 py-2 rounded-md text-white hover:bg-blue-700 duration-150">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
