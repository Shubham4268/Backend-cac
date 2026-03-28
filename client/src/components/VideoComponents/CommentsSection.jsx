import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";

const BASE = import.meta.env.VITE_BACKEND_BASEURL;

/* ─── helpers ───────────────────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/* ─── single comment row ─────────────────────────────────────────── */
function CommentItem({ comment, currentUser, theme, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isOwner =
    !!currentUser && !!comment.owner &&
    currentUser._id?.toString() === comment.owner._id?.toString();

  /* close menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleUpdate = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const res = await axios.patch(
        `${BASE}/api/v1/comments/c/${comment._id}`,
        { content: trimmed }
      );
      if (res?.data?.success) {
        onUpdate(comment._id, trimmed);
        setEditing(false);
        toast.success("Comment updated");
      }
    } catch (err) {
      handleApiError(err, (msg) => toast.error(msg || "Failed to update"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    try {
      await axios.delete(`${BASE}/api/v1/comments/c/${comment._id}`);
      onDelete(comment._id);
      toast.success("Comment deleted");
    } catch (err) {
      handleApiError(err, (msg) => toast.error(msg || "Failed to delete"));
    }
  };

  return (
    <div
      className={`group flex gap-3 py-4 border-b last:border-b-0 ${theme === "dark" ? "border-white/10" : "border-gray-200"
        }`}
    >
      {/* Avatar */}
      <img
        src={comment.owner?.avatar || "/default-avatar.png"}
        alt={comment.owner?.fullName || "User"}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
      />

      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-sm font-semibold truncate ${theme === "dark" ? "text-white" : "text-gray-900"
              }`}
          >
            {comment.owner?.fullName || "Unknown User"}
          </span>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Body — edit mode or read mode */}
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              className={`w-full rounded-lg px-3 py-2 text-sm border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${theme === "dark"
                ? "bg-gray-900 border-white/15 text-gray-100"
                : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={saving || !draft.trim()}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setDraft(comment.content);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
          >
            {comment.content}
          </p>
        )}
      </div>

      {/* 3-dot menu — only visible for owner */}
      {isOwner && !editing && (
        <div ref={menuRef} className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className={`p-1.5 rounded-full transition ${theme === "dark"
              ? "hover:bg-white/10 text-gray-400"
              : "hover:bg-gray-100 text-gray-500"
              }`}
            aria-label="Comment options"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 4 15"
            >
              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 top-8 z-20 w-28 rounded-lg shadow-xl border py-1 ${theme === "dark"
                ? "bg-gray-800 border-white/10"
                : "bg-white border-gray-200"
                }`}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition ${theme === "dark"
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── main section ───────────────────────────────────────────────── */
function CommentsSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [focused, setFocused] = useState(false);

  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const theme = useSelector((state) => state.theme.theme);

  /* ── fetch page ── */
  const fetchComments = async (pageNum = 1, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const res = await axios.get(
        `${BASE}/api/v1/comments/${videoId}?page=${pageNum}&limit=10`
      );
      const d = res?.data?.data;
      setTotalComments(d?.totalComments ?? 0);
      setHasNextPage(!!d?.nextPage);
      setComments((prev) =>
        append ? [...prev, ...(d?.comments ?? [])] : (d?.comments ?? [])
      );
    } catch (err) {
      // If no comments yet (404) just silently show empty state
      if (err?.response?.status !== 404) {
        handleApiError(err, (msg) => toast.error(msg || "Failed to load comments"));
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      setPage(1);
      fetchComments(1, false);
    }
  }, [videoId]);

  /* ── add comment ── */
  const handlePost = async () => {
    const content = draft.trim();
    if (!content) return;
    setPosting(true);
    try {
      const res = await axios.post(
        `${BASE}/api/v1/comments/${videoId}`,
        { content }
      );
      if (res?.data?.success) {
        setDraft("");
        setFocused(false);
        toast.success("Comment posted!");
        // Refresh from page 1 to pick up server-generated _id & owner lookup
        setPage(1);
        fetchComments(1, false);
      }
    } catch (err) {
      handleApiError(err, (msg) => toast.error(msg || "Failed to post comment"));
    } finally {
      setPosting(false);
    }
  };

  /* ── local update (no re-fetch) ── */
  const handleUpdate = (id, newContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, content: newContent } : c))
    );
  };

  /* ── local delete ── */
  const handleDelete = (id) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
    setTotalComments((prev) => Math.max(0, prev - 1));
  };

  /* ── load more ── */
  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchComments(next, true);
  };

  return (
    <section
      className={`w-full border-2 my-10 ml-4 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[650px] ${theme === "dark"
        ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10"
        : "bg-white border border-gray-200"
        }`}
    >
      {/* Section header */}
      <div
        className={`px-6 py-4 border-b flex items-center gap-3 ${theme === "dark" ? "border-white/10" : "border-gray-200"
          }`}
      >
        <svg
          className={`w-5 h-5 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z"
          />
        </svg>
        <h2
          className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"
            }`}
        >
          Comments
        </h2>
        <span
          className={`ml-1 text-sm px-2 py-0.5 rounded-full font-medium ${theme === "dark"
            ? "bg-white/10 text-gray-300"
            : "bg-gray-100 text-gray-600"
            }`}
        >
          {totalComments}
        </span>
      </div>

      <div className="flex-1 px-6 py-5 overflow-y-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* ── Add comment input ── */}
        {user ? (
          <div className="flex gap-3 mb-6">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.fullName}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1"
            />
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                id="comment-input"
                placeholder="Add a comment…"
                value={draft}
                rows={focused ? 3 : 1}
                onFocus={() => setFocused(true)}
                onChange={(e) => setDraft(e.target.value)}
                className={`w-full rounded-xl px-4 py-2.5 text-sm border resize-none transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${theme === "dark"
                  ? "bg-gray-800/60 border-white/15 text-gray-100 placeholder:text-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                  }`}
              />
              {focused && (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setDraft("");
                      setFocused(false);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={posting || !draft.trim()}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50 transition"
                  >
                    {posting ? "Posting…" : "Post"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p
            className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
          >
            Sign in to leave a comment.
          </p>
        )}

        {/* ── Comments list ── */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-300/30 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 rounded bg-gray-300/30" />
                  <div className="h-3 w-3/4 rounded bg-gray-300/20" />
                  <div className="h-3 w-1/2 rounded bg-gray-300/20" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2">
            <svg
              className={`w-10 h-10 ${theme === "dark" ? "text-gray-600" : "text-gray-300"
                }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z"
              />
            </svg>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
            >
              No comments yet. Be the first!
            </p>
          </div>
        ) : (
          <div>
            {comments.map((c) => (
              <CommentItem
                key={c._id}
                comment={c}
                currentUser={user}
                theme={theme}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}

            {hasNextPage && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className={`mt-4 w-full py-2 rounded-xl text-sm font-medium transition ${theme === "dark"
                  ? "bg-white/5 hover:bg-white/10 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } disabled:opacity-50`}
              >
                {loadingMore ? "Loading…" : "Load more comments"}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default CommentsSection;
