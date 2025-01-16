import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom"; // Add this hook
import axios from "axios";
import { handleApiError } from "../../utils/errorHandler.js";
import { toast, ToastContainer } from "react-toastify";
import { change } from "../../features/slices/tweetSlice";

function AddTweetForm() {
  const [formData, setFormData] = useState({ content: "" });
  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const tweet = useSelector((state) => state.tweet?.tweetData);
  const dispatch = useDispatch();
  const location = useLocation(); // Track the current route

  useEffect(() => {
    if (tweet) {
      setEditing(true);
      setPostData(tweet);
      setFormData({ content: tweet.content });
    }
  }, [tweet]);

  // Listen for page navigation
  useEffect(() => {
    return () => {
      dispatch(change(null)); // Reset the state when leaving the page
    };
  }, [dispatch, location]);

  const notify = (text) => toast(text);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const url = editing
      ? `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/tweets/${postData?._id}`
      : `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/tweets/create-Tweet`;
    const method = editing ? "patch" : "post";

    try {
      const response = await axios[method](url, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { data } = response?.data || {};
      setPostData(editing ? data : data?.tweet);
      setFormData({ content: "" });

      if (editing) {
        notify("Tweet updated successfully!");
      } else {
        notify("Tweet added successfully!");
      }

      dispatch(change(null));
      setEditing(false);
    } catch (err) {
      handleApiError(err, setError);
    }
  };

  const handleEdit = () => {
    setFormData({ content: postData?.content });
    setEditing(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/tweets/${postData?._id}`);
      setFormData({ content: "" });
      setEditing(false);
      setPostData(null);
      notify("Tweet deleted successfully");
    } catch (err) {
      handleApiError(err, setError);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-fit">
      <div className="mb-12 shadow-lg w-2/5 h-2/3 p-5 bg-gray-800 rounded-lg text-white">
        <ToastContainer />

        <h2 className="text-center text-2xl font-bold my-3">What's on your mind?</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="w-3/4 flex flex-col items-center mx-auto space-y-3">
          {user && (
            <div className="flex mt-5 self-start">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-8 h-8 rounded-full mr-3 object-cover"
              />
              <span className="self-center">{user.fullName}</span>
            </div>
          )}

          {postData && !editing ? (
            <div className="w-full flex flex-col items-center">
              <div className="block w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-500">
                <div className="font-normal text-gray-700 dark:text-gray-200 h-28 overflow-scroll no-scrollbar">
                  {postData.content}
                </div>
              </div>
              <div className="flex space-x-5">
                <button
                  onClick={handleEdit}
                  type="button"
                  className="mt-4 w-fit rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline focus:outline-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  type="button"
                  className="mt-4 w-fit rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline focus:outline-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <textarea
                placeholder="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                className="block w-full text-wrap h-28 max-h-28 rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
              />
              <button
                type="submit"
                className="mt-4 w-fit rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline focus:outline-indigo-600"
              >
                {editing ? "Update" : "Post"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddTweetForm;
