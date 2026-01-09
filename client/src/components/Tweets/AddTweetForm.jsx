import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    if (tweet) {
      setEditing(true);
      setPostData(tweet);
      setFormData({ content: tweet.content });
    }
  }, [tweet]);

  useEffect(() => {
    return () => {
      dispatch(change(null));
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

      notify(editing ? "Tweet updated successfully!" : "Tweet added successfully!");

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
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/tweets/${postData?._id}`
      );
      setFormData({ content: "" });
      setEditing(false);
      setPostData(null);
      notify("Tweet deleted successfully");
    } catch (err) {
      handleApiError(err, setError);
    }
  };

  return (
    <div className="flex justify-center px-6 py-20">
      <ToastContainer />

      <div
        className="
          w-full max-w-xl
          bg-gray-800
          backdrop-blur-xl
          border border-white/15
          rounded-2xl
          shadow-xl
          px-8 py-7 text-white
        "
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            What’s on your mind?
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            Share something with your followers
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-center text-sm mb-3">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-5"
        >
          {/* User */}
          {user && (
            <div className="flex items-center gap-3 self-start">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
              <span className="text-sm text-gray-200 font-medium">
                {user.fullName}
              </span>
            </div>
          )}

          {/* View mode */}
          {postData && !editing ? (
            <div className="w-full flex flex-col items-center space-y-4">

              <div className="w-full p-4 rounded-xl bg-gray-900 border border-white/10 text-gray-200 text-sm leading-relaxed max-h-40 overflow-y-auto no-scrollbar">
                {postData.content}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleEdit}
                  type="button"
                  className="
                    px-5 py-2 rounded-lg
                    bg-indigo-600 text-white text-sm font-semibold
                    hover:bg-indigo-500 transition
                  "
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  type="button"
                  className="
                    px-5 py-2 rounded-lg
                    bg-red-600 text-white text-sm font-semibold
                    hover:bg-red-500 transition
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Input */}
              <textarea
                placeholder="Write something..."
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                className="
                  w-full min-h-[100px] rounded-lg
                  bg-gray-900 text-gray-100
                  px-3.5 py-2 text-sm
                  border border-white/15
                  placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40
                  transition
                "
              />

              {/* CTA */}
              <button
                type="submit"
                className="
                  px-6 py-2 rounded-lg
                  bg-indigo-600 text-white text-sm font-semibold
                  shadow-md 
                  hover:bg-indigo-500 
                  transition
                "
              >
                {editing ? "Update Tweet" : "Post Tweet"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddTweetForm;
