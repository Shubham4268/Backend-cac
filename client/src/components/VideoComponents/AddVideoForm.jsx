import axios from "axios";
import { handleApiError } from "../../utils/errorHandler.js";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";

const InputField = ({ type = "text", name, value, onChange, placeholder }) => (
  <div className="w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="
        w-full rounded-xl
        bg-gray-950/60 text-gray-100
        px-4 py-2.5 text-sm
        border border-white/10
        placeholder:text-gray-500
        focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40
        transition
      "
    />
  </div>
);

function AddVideoForm() {
  const notify = (text) => toast(text);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState(null);

  const videoFileRef = useRef(null);
  const thumbnailRef = useRef(null);
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (videoFileRef.current?.files[0]) {
      data.append("videoFile", videoFileRef.current.files[0]);
    }

    if (thumbnailRef.current?.files[0]) {
      data.append("thumbnail", thumbnailRef.current.files[0]);
    }

    try {
      dispatch(setLoading(true));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/videos/`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.success) {
        const id = response?.data?.data?._id;
        notify("Video uploaded successfully 🚀");
        navigate(`/video/${id}`);
      }
    } catch (error) {
      handleApiError(error, setError);
      setFormData({ title: "", description: "" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full  text-white relative overflow-hidden">

      {/* Ambient glow */}
     
      <div className="relative flex justify-center px-6 py-24">
        <ToastContainer />

        {/* Card */}
        <div
          className="
            w-full max-w-xl
            rounded-2xl
            border border-white/10
            bg-slate-800 backdrop-blur-3xl
            px-8 py-8
          "
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold tracking-tight bg-white bg-clip-text text-transparent">
              Upload a new video
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Share your content with the TwiTube community
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-center text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="flex flex-col space-y-6">

            {/* Text fields */}
            <div className="space-y-3">
              <InputField
                placeholder="Video title"
                onChange={onChange}
                name="title"
                value={formData.title}
              />

              <textarea
                placeholder="Video description"
                name="description"
                value={formData.description}
                onChange={onChange}
                required
                className="
                  w-full min-h-[90px] rounded-xl
                  bg-gray-950/60 text-gray-100
                  px-4 py-2.5 text-sm
                  border border-white/10
                  placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40
                  transition
                "
              />
            </div>

            {/* Upload blocks */}
            <div className="space-y-3">

              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-gray-950/60 hover:border-white/20 transition">
                <span className="text-xs text-gray-400 w-28 shrink-0">
                  Video file *
                </span>
                <input
                  ref={videoFileRef}
                  className="block w-full text-xs text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-500
                    cursor-pointer"
                  type="file"
                  accept="video/*"
                />
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-gray-950/60 hover:border-white/20 transition">
                <span className="text-xs text-gray-400 w-28 shrink-0">
                  Thumbnail
                </span>
                <input
                  ref={thumbnailRef}
                  className="block w-full text-xs text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:bg-gray-700 file:text-white
                    hover:file:bg-gray-600
                    cursor-pointer"
                  type="file"
                  accept="image/*"
                />
              </div>

            </div>

            {/* CTA */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="
                  relative overflow-hidden
                  px-8 py-2.5 rounded-xl
                  bg-indigo-600 text-white text-sm font-medium
                  shadow-lg 
                  hover:bg-indigo-500 
                  active:scale-[0.98]
                  transition
                "
              >
                Upload video
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddVideoForm;
