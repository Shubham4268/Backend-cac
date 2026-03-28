import { Outlet } from "react-router-dom";
import { Footer, Header, Navbar } from "./components/index.js";
import { useSelector } from "react-redux";
import { useSessionValidator } from "./hooks/useSessionValidator.js";
import { Toaster } from "react-hot-toast";

function App() {
  const theme = useSelector((state) => state.theme.theme);

  // Validate the persisted session against the backend on every app load.
  // This ensures stale localStorage auth state doesn't keep users "logged in"
  // after their cookies have expired.
  useSessionValidator();

  return (
    <>
      <div
        className={`w-full flex flex-row font-sans min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-b from-gray-200 to-white text-gray-900"
        }`}
      >
        <Header />
        <Outlet />
      </div>
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#111827" : "#fff",
            color: theme === "dark" ? "#fff" : "#1f2937",
          },
        }}
      />
    </>
  );
}

export default App;
