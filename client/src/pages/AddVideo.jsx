import AddVideoForm from "../components/VideoComponents/AddVideoForm";
import { useSelector } from "react-redux";

function AddVideo() {
  const collapsed = useSelector((state) => state.navbar.collapsed);

  return (
    <div
      className={`min-h-screen w-full transition-all duration-300 py-10
      ${collapsed ? "ml-16" : "ml-60"}`}
    >
      <AddVideoForm />
    </div>
  );
}

export default AddVideo;
