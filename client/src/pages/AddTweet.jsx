import { AddTweetForm } from "../components";
import { useSelector } from "react-redux";

function AddTweet() {
  const collapsed = useSelector((state) => state.navbar.collapsed);
  const theme = useSelector((state) => state.theme.theme);

  return (
    <>
    <div className={`mt-28 text-white w-full h-screen transition-all duration-300 ${
      collapsed ? 'ml-16' : 'ml-60'
    }`} >
        <AddTweetForm />
    </div>
      
    </>
  );
}

export default AddTweet;
