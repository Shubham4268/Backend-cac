import { Link } from "react-router-dom";

function Settings() {
  return (
    <>
      <div className="ml-56 mt-24 flex flex-col text-white">
        <Link to={"/change-password"}>Change Password</Link>
        <Link to={"/update-account"}>Update Account</Link>
      </div>
    </>
  );
}

export default Settings;
