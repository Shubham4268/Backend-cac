import axios from "axios";
import { handleApiError } from "../../utils/errorHandler.js";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";
import { validateFile } from "../../utils/validation.js";

const InputField = ({ type = "text", name, value, onChange, placeholder, theme, error, maxLength }) => (
  <div className="w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      maxLength={maxLength}
      className={`
        w-full rounded-lg px-4 py-2.5 text-sm border transition
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40
        ${theme === "dark"
          ? "bg-gray-900 text-gray-100 border-gray-600 placeholder:text-gray-400"
          : "bg-gray-50 text-gray-900 border-gray-300 placeholder:text-gray-400"
        }
        ${error ? "border-red-500 focus:border-red-500" : ""}
      `}
    />
    {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
  </div>
);

function AddVideoForm() {
  const notify = (text) => toast.success(text);
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);
  const loading = useSelector((state) => state.loader.loading);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const videoFileRef = useRef(null);
  const thumbnailRef = useRef(null);
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    const videoFile = videoFileRef.current?.files[0];
    const thumbnailFile = thumbnailRef.current?.files[0];

    if (!videoFile) {
      setError("Video file is required");
      return;
    }

    if (!thumbnailFile) {
      setError("Thumbnail is required");
      return;
    }

    // Validate Video (Max 50MB)
    const videoError = validateFile(videoFile, 50, ["video/mp4", "video/webm", "video/ogg", "video/*"]);
    if (videoError) {
      setError(`Video Error: ${videoError}`);
      return;
    }

    // Validate Thumbnail (Max 2MB)
    const thumbnailError = validateFile(thumbnailFile, 2, ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/*"]);
    if (thumbnailError) {
      setError(`Thumbnail Error: ${thumbnailError}`);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    data.append("videoFile", videoFile);
    data.append("thumbnail", thumbnailFile);

    try {
      dispatch(setLoading(true));
      setIsUploading(true);
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
      // Keep isUploading true until navigation for success, 
      // or false if there was an error.
      if (error) setIsUploading(false);
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


        {/* Card */}
        <div
          className={`
            w-full max-w-xl rounded-2xl px-8 py-8
            ${theme === "dark"
              ? "border border-gray-700 bg-gray-800 shadow-2xl"
              : "border border-gray-200 bg-white shadow-xl"
            }
          `}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-semibold tracking-tight ${theme === "dark" ? "text-white" : "text-black"
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
                maxLength={50}
                error={error && error.includes("Title") ? error : null}
              />

              <textarea
                placeholder="Video description"
                name="description"
                value={formData.description}
                onChange={onChange}
                required
                maxLength={500}
                className={`
                  w-full min-h-[90px] rounded-lg px-4 py-2.5 text-sm border transition
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40
                  ${theme === "dark"
                    ? "bg-gray-900 text-gray-100 border-gray-600 placeholder:text-gray-400"
                    : "bg-gray-50 text-gray-900 border-gray-300 placeholder:text-gray-400"
                  }
                `}
              />
            </div>

            {/* Upload blocks */}
            <div className="space-y-3">

              <div className={`flex items-center gap-4 p-4 rounded-lg border transition ${theme === "dark"
                ? "border-gray-600 bg-gray-900 hover:border-gray-500"
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
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    cursor-pointer
                    ${theme === "dark" ? "text-gray-300" : "text-gray-700"}
                  `}
                  type="file"
                  accept="video/*"
                />
              </div>


              <div className={`flex items-center gap-4 p-4 rounded-lg border transition ${theme === "dark"
                ? "border-gray-600 bg-gray-900 hover:border-gray-500"
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
                    file:bg-gray-600 file:text-white
                    hover:file:bg-gray-500
                    cursor-pointer
                    ${theme === "dark" ? "text-gray-400" : "text-gray-700"}
                  `}
                  type="file"
                  accept="image/*"
                />
              </div>


            </div>

            {/* Upload network handling & server progression */}
            {isUploading && (
              <div className="space-y-3 mt-2 px-1 animate-slide-up duration-300">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                    {uploadProgress === 100 
                      ? "Usually takes 5-20s..." 
                      : `Uploading... ${uploadProgress === 0 ? "Preparing files" : ""}`}
                  </span>
                  <span className={`${uploadProgress === 100 ? "text-green-500" : "text-blue-500"} font-bold text-sm drop-shadow-sm`}>
                    {uploadProgress}%
                  </span>
                </div>
                
                <div className={`w-full h-3 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ease-out shadow-lg shadow-blue-500/10 ${
                      uploadProgress === 100 
                        ? "bg-green-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" 
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {uploadProgress === 100 && (
                  <p className="text-[10px] text-center opacity-50 italic animate-pulse">
                     Optimizing and encrypting your video...
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={isUploading}
                className={`
                  relative overflow-hidden
                  px-10 py-3 rounded-xl
                  font-bold text-sm shadow-xl transition-all active:scale-[0.98]
                  flex items-center gap-2
                  ${isUploading
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                  }
                `}
              >
                {isUploading && uploadProgress === 100 ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Finalizing...</>
                ) : isUploading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                ) : (
                  <>
                     Upload video
                  </>
                )}
              </button>
            </div>

          </form>
        </div >
      </div >
    </div >
  );
}

export default AddVideoForm;
