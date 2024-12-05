import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleApiError } from "../../utils/errorHandler";
import { login } from "../../features/slices/authSlice";
import Successmsg from "../Successmsg";
import { useNavigate } from "react-router-dom";

function UpdateAccount() {
  const response = useSelector((state) => state.user.userData);
  const { loggedInUser: user } = response || {};
  const [successAlert, setSuccessAlert] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
  });   
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleNavigation = () => {
    setTimeout(() => {
      
      navigate("/settings");
    }, 4000); // 3000ms = 3 seconds
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
  
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/v1/users/update-account",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {        
        // Dispatch the updated user data to Redux store
        dispatch(login(response.data.data)); // Assuming updated user data is in `data` field
        // Optionally reset the form state to match the updated data
        setSuccessAlert(true);

        setFormData({
          fullName: response.data.data.fullName || "",
          email: response.data.data.email || "",
        });
        handleNavigation()
        
      }
    } catch (err) {
      handleApiError(err, setError);
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="mt-28 mb-12 shadow-lg w-1/3 p-5 bg-gray-800 rounded-lg text-white ">
      {successAlert && <Successmsg text = "Password changed Successfully!!"/>}
      <h2 className="mt-6 mb-3 text-center text-2xl/9 font-bold tracking-tight text-white">
          Update your account details
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
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
          />

          <div className="input-group flex flex-col w-full items-center">
            <button
              type="submit"
              className="mt-3 w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Update
            </button>
          </div>
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
      className="mt-2 block w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    />
  </div>
);

export default UpdateAccount;
