import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { handleApiError } from "../../utils/errorHandler";
import { setLoading as setGlobalLoading } from "../../features/slices/loaderSlice";

function EditVideoModal({ video, onClose, onUpdate }) {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: video?.title || "",
    description: video?.description || "",
  });
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const thumbnailRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLocalLoading(true);
    dispatch(setGlobalLoading(true));

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (thumbnailRef.current?.files[0]) {
      data.append("thumbnail", thumbnailRef.current.files[0]);
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/videos/${video._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.success) {
        toast.success("Video updated successfully!");
        onUpdate(response.data.data);
        onClose();
      }
    } catch (err) {
      handleApiError(err, setError);
    } finally {
      setLocalLoading(false);
      dispatch(setGlobalLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center px-4 overflow-hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
      
      <div 
        className={`relative w-full max-w-lg p-6 rounded-2xl shadow-xl transition-all duration-300 animate-slide-up
          ${isDark 
            ? "bg-gray-900 border border-gray-700 text-white" 
            : "bg-white border border-gray-200 text-gray-900"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            Edit Video Details
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium opacity-70 ml-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition-all
                ${isDark ? "bg-gray-700 border-gray-600 focus:border-blue-500" : "bg-gray-50 border-gray-300 focus:border-blue-500"}`}
              placeholder="Enter title..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium opacity-70 ml-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition-all resize-none
                ${isDark ? "bg-gray-700 border-gray-600 focus:border-blue-500" : "bg-gray-50 border-gray-300 focus:border-blue-500"}`}
              placeholder="Enter description..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium opacity-70 ml-1">Update Thumbnail (Optional)</label>
            <div className={`flex items-center gap-4 p-3 rounded-lg border transition
              ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}>
              <ImageIcon className="w-5 h-5 opacity-40 shrink-0" />
              <input
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                className="text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs italic font-medium ml-1 text-center">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={localLoading}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2
                ${isDark ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md active:bg-blue-800" : "bg-blue-700 hover:bg-blue-800 text-white shadow-md active:bg-blue-900"}`}
            >
              {localLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Saving changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideoModal;
