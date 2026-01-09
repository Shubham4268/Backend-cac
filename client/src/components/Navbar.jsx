import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { handleApiError } from "../utils/errorHandler.js";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/slices/authSlice.js";
import { toggleNavbar } from "../features/slices/navbarSlice.js";
import { persistor } from "../app/store.js";
import { 
  Menu, 
  X, 
  Home, 
  Rss, 
  Video, 
  MessageSquarePlus, 
  User, 
  Info,
  LogOut
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Explore",
    items: [
      { to: "/home", label: "Home", icon: <Home size={20} /> },
      { to: "/subscription", label: "Subscriptions", icon: <Rss size={20} /> },
    ],
  },
  {
    title: "Create",
    items: [
      { to: "/addVideo", label: "Add Video", icon: <Video size={20} /> },
      { to: "/addTweet", label: "Add Tweet", icon: <MessageSquarePlus size={20} /> },
    ],
  },
  {
    title: "Account",
    items: [
      { key: "profile", label: "Your Profile", icon: <User size={20} /> },
      { to: "/about", label: "About TwiTube", icon: <Info size={20} /> },
    ],
  },
];

const Navbar = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user?.userData);
  const theme = useSelector((state) => state.theme.theme);
  const collapsed = useSelector((state) => state.navbar.collapsed);
  const { loggedInUser } = currentUser || {};
  const { username } = loggedInUser || {};
const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/logout`
      );

      persistor.purge();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  return (
    <aside
      className={`fixed top-[75px] left-0 h-full 
      ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 text-white'
          : 'bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 text-gray-900'
      }
      transition-all duration-300 ease-in-out z-30
      ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Toggle */}
      <div className={`flex justify-start px-3 py-3 border-b ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <button
          onClick={() => dispatch(toggleNavbar())}
          className={`p-2 rounded-lg transition ${
            theme === 'dark' 
              ? 'hover:bg-gray-800' 
              : 'hover:bg-gray-100'
          }`}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="px-2 py-4 space-y-6">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i}>
            {!collapsed && (
              <p className={`px-3 mb-2 text-xs uppercase tracking-widest ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((item, idx) => {
                const path =
                  item.key === "profile"
                    ? `/profile/${username}`
                    : item.to;

                return (
                  <NavLink
                    key={idx}
                    to={path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl 
                      transition-all duration-200 relative overflow-hidden
                      ${
                        isActive
                          ? theme === 'dark'
                            ? "bg-blue-600/10 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                          : theme === 'dark'
                            ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`
                    }
                  >
                    {/* Active bar */}
                    <span
                      className={`absolute left-0 top-0 h-full w-1 rounded-r 
                      transition-opacity ${
                        location.pathname === path
                          ? "opacity-100"
                          : "opacity-0"
                      } ${
                        theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                      }`}
                    />

                    <span className="text-xl">{item.icon}</span>

                    {!collapsed && (
                      <span className="text-sm font-medium tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className={`pt-4 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <button
  onClick={() => setShowLogoutModal(true)}
  className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
  transition ${
    theme === 'dark'
      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
      : "text-red-500 hover:bg-red-50 hover:text-red-600"
  }`}
>
  <LogOut size={20} />
  {!collapsed && (
    <span className="text-sm font-medium tracking-wide">
      Logout
    </span>
  )}
</button>

        </div>
      </nav>

      {error && (
        <p className={`text-xs text-center px-3 mt-2 ${
          theme === 'dark' ? 'text-red-400' : 'text-red-500'
        }`}>
          {error}
        </p>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-white/10'
              : 'bg-white border-gray-200'
          }`}>
            {/* Title */}
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Confirm logout
            </h2>

            <p className={`text-sm mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              You will be signed out of your account. Any unsaved work may be lost.
            </p>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logoutHandler();
                }}
                className="px-5 py-2 rounded-lg text-sm font-semibold
                           bg-red-600 text-white
                           hover:bg-red-500
                           shadow-lg shadow-red-600/30
                           transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Navbar;
