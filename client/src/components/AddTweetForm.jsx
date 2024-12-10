import { useState } from "react";
import Successmsg from "./Common/Successmsg";
import { useSelector } from "react-redux";
import axios from "axios";
import { handleApiError } from "../utils/errorHandler";
import { ToastContainer, toast } from 'react-toastify';

function AddTweetForm() {
  const [formData, setFormData] = useState({
    content: "",
  });
  const [added, setAdded] = useState(null);
  const [error, setError] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  const [editing, setEditing] = useState(false);
  const [postData, setPostData] = useState(null);
  const userObject = useSelector((state) => state.user.userData);
  const { loggedInUser: user } = userObject || {};

  const onchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!editing) {
        const response = await axios.post(
          "http://localhost:8000/api/v1/tweets/create-Tweet",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { data } = response?.data || {};
        setPostData(data);
        setAdded(formData.content);
        setFormData({ content: "" });
        setSuccessAlert(true);
      } else {
        
        const id = postData?.tweet?._id
        const response = await axios.patch(
          `http://localhost:8000/api/v1/tweets/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { data } = response?.data || {};
        setPostData(data);
        setAdded(formData.content);
        setFormData({ content: "" });
        setSuccessAlert(true);
        setEditing(false);
      }
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const onClickEdit = () => {
    setSuccessAlert(false);
    setFormData({ content: added });
    console.log(added);
    console.log(formData);
    setAdded(null);
    setEditing(true);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-fit ">
        <div className="mb-12 shadow-lg w-2/5 h-2/3 p-5 bg-gray-800 rounded-lg text-white ">
          {successAlert && <Successmsg text="Tweet added Successfully!!" />  }
          <h2 className="text-center text-2xl/9 font-bold text-white my-3">
            What's on your mind
          </h2>
          {error && <p className="text-red-500 text-center ">{error}</p>}
          <form
            onSubmit={onsubmit}
            className="w-3/4 flex flex-col items-center mx-auto space-y-3 "
          >
            {user && (
              <div className="flex mt-5 self-start">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full mr-3 "
                />
                <span className="self-center">{user.fullName}</span>
              </div>
            )}

            {added ? (
              <div>
                <div className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-500 dark:hover:bg-gray-700">
                  <div className="font-normal text-wrap text-gray-700 dark:text-gray-200 h-28 max-h-28 max-w-sm overflow-scroll no-scrollbar">
                    {added}
                  </div>
                </div>
                <div className="input-group flex flex-col w-full items-center">
                  <button
                    onClick={onClickEdit}
                    type="submit"
                    className="mt-4 w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="input-group flex flex-col w-full ">
                  <textarea
                    placeholder="Content"
                    name="content"
                    value={formData.content}
                    onChange={onchange}
                    required
                    className="block w-full text-wrap h-28 max-h-28 rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
                  />
                </div>

                <div className="input-group flex flex-col w-full items-center">
                  <button
                    type="submit"
                    className="mt-4 w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Post
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
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
      className="block mt-3 w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    />
  </div>
);
export default AddTweetForm;
