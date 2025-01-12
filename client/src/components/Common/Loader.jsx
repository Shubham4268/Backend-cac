import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {FadeLoader} from "react-spinners"

function Loader() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  
  if (!isLoading) return null;


  return (
    <div className="ml-52 mt-20 text-white w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-gray-900 z-50">
      <div className="loader mb-40 mr-60"><FadeLoader color="#3f53d0" /></div>
    </div>
  );
}

export default Loader;


