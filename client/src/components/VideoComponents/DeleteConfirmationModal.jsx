import { useSelector } from "react-redux";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";

function DeleteConfirmationModal({ videoTitle, onConfirm, onClose, loading }) {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 z-[110] flex justify-center items-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
      
      <div 
        className={`relative w-full max-w-md p-6 rounded-2xl shadow-xl transition-all duration-300 animate-slide-up
          ${isDark 
            ? "bg-gray-900 border border-gray-700 text-white" 
            : "bg-white border border-gray-200 text-gray-900"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? "bg-red-500/10" : "bg-red-50"}`}>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Delete Video?
            </h2>
          </div>
          <button onClick={onClose} className={`p-1 rounded-full transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Are you sure you want to permanently delete <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>"{videoTitle}"</span>? 
            This action cannot be undone and will remove all associated views and data.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all
              ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-lg font-medium text-sm bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
