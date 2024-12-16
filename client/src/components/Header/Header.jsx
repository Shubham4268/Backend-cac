import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch({ target: { value } }); // Trigger search on each change
  };

  const location = useLocation()
  const navigate= useNavigate();

  const redirecToHomePage=()=>{
    navigate('/home');
  }


  return (
    <div className="z-10 flex fixed top-0 w-full py-5 bg-gray-800 text-white">
      <span onClick={redirecToHomePage} className="text-4xl ml-5 cursor-pointer z-10">📹VIDEO</span>
      <div className="absolute inset-0 flex justify-center">
        <form
          className="max-w-md w-full self-center"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {location.pathname==="/home" && <div className="relative">
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
          </div>}
        </form>
      </div>
    </div>
  );
}

export default Header;