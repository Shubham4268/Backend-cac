import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useSelector, useDispatch } from "react-redux";
import { FcCamcorderPro  } from "react-icons/fc";
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../../features/slices/themeSlice";

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch({ target: { value } }); // Trigger search on each change
  };

  const location = useLocation();
  const navigate = useNavigate();

  const redirecToHomePage = () => {
    navigate("/home");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className={`z-10 flex fixed top-0 w-full h-[75px] py-4 text-white ${
      theme === 'dark' 
        ? 'bg-gray-800' 
        : 'bg-white border-b border-gray-200'
    }`}>
      <span
        onClick={redirecToHomePage}
        className="text-4xl ml-5 cursor-pointer z-10"
      >
        <span className="flex space-x-3 items-center">
          {/* <FcCamcorderPro className=" hover:animate-spin	"/> */}
          <img src="./twitube1.2.png" alt="" width={"55px"} className=""/>
          <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Twi<span className="text-blue-600">Tube</span>
          </div>
        </span>
      </span>
      <div className="absolute inset-0 flex justify-center">
        <form
          className="max-w-md w-full self-center"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {location.pathname === "/home" && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={handleSearch} // Trigger search dynamically
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => onSearch({ target: { value: searchQuery } })}
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          )}
        </form>
      </div>
      {location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/about" && (
        <div className="absolute self-baseline right-10 flex items-center gap-4">
          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <ProfileDropdown user={user} />
        </div>
      )}
    </div>
  );
}

export default Header;
