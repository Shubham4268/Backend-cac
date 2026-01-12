import axios from "axios";
import { handleApiError } from "../../utils/errorHandler.js";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";

const InputField = ({ type = "text", name, value, onChange, placeholder, theme }) => (
  <div className="w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className={`
        w-full rounded-xl px-4 py-2.5 text-sm border transition
        focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40
        ${theme === "dark"
          ? "bg-gray-950/60 text-gray-100 border-white/10 placeholder:text-gray-500"
          : "bg-gray-50 text-gray-900 border-gray-300 placeholder:text-gray-400"
        }
      `}
    />
  </div>
);

function AddVideoForm() {
  const notify = (text) => toast(text);
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      setUploadProgress(0);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/videos/`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
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
      setUploadProgress(0);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${theme === "dark" ? "text-white" : "text-gray-900"
      }`}>

      {/* Ambient glow */}

      <div className="relative flex justify-center px-6 py-24">
        <ToastContainer />

        {/* Card */}
        <div
          className={`
            w-full max-w-xl rounded-2xl px-8 py-8
            ${theme === "dark"
              ? "border border-white/10 bg-slate-800 backdrop-blur-3xl"
              : "border border-gray-200 bg-white shadow-xl"
            }
          `}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-semibold tracking-tight bg-white bg-clip-text  ${theme === "dark" ? "text-transparent" : "text-black"
              }`}>
              Upload a new video
            </h2>
            <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
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
                theme={theme}
              />

              <textarea
                placeholder="Video description"
                name="description"
                value={formData.description}
                onChange={onChange}
                required
                className={`
                  w-full min-h-[90px] rounded-xl px-4 py-2.5 text-sm border transition
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40
                  ${theme === "dark"
                    ? "bg-gray-950/60 text-gray-100 border-white/10 placeholder:text-gray-500"
                    : "bg-gray-50 text-gray-900 border-gray-300 placeholder:text-gray-400"
                  }
                `}
              />
            </div>

            {/* Upload blocks */}
            <div className="space-y-3">

              <div className={`flex items-center gap-4 p-4 rounded-xl border transition ${theme === "dark"
                ? "border-white/10 bg-gray-950/60 hover:border-white/20"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}>
                <span className={`text-xs w-28 shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                  Video file *
                </span>
                <input
                  ref={videoFileRef}
                  className={`block w-full text-xs
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-500
                    cursor-pointer
                    ${theme === "dark" ? "text-gray-300" : "text-gray-700"}
                  `}
                  type="file"
                  accept="video/*"
                />
              </div>


              <div className={`flex items-center gap-4 p-4 rounded-xl border transition ${theme === "dark"
                  ? "border-white/10 bg-gray-950/60 hover:border-white/20"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}>
                <span className={`text-xs w-28 shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                  Thumbnail
                </span>
                <input
                  ref={thumbnailRef}
                  className={`block w-full text-xs
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:bg-gray-700 file:text-white
                    hover:file:bg-gray-600
                    cursor-pointer
                    ${theme === "dark" ? "text-gray-300" : "text-gray-700"}
                  `}
                  type="file"
                  accept="image/*"
                />
              </div>


            </div>

            {/* Upload Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Uploading...</span>
                  <span className="text-indigo-400 font-semibold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={uploadProgress > 0 && uploadProgress < 100}
                className="
                  relative overflow-hidden
                  px-8 py-2.5 rounded-xl
                  bg-indigo-600 text-white text-sm font-medium
                  shadow-lg 
                  hover:bg-indigo-500 
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition
                "
              >
                {uploadProgress > 0 && uploadProgress < 100 ? "Uploading..." : "Upload video"}
              </button>
            </div>

          </form>
        </div >
      </div >
    </div >
  );
}

export default AddVideoForm;
