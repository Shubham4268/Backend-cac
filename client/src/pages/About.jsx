import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Play, Server, Shield, Sparkles, Globe, Cpu } from "lucide-react";

function About() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.user.status);
  const theme = useSelector((state) => state.theme.theme);
  const collapsed = useSelector((state) => state.navbar.collapsed);

  // Determine if the Navbar (sidebar) is actually visible.
  // It is visible if the user is authenticated (as per ShowNavbar logic).
  const isNavbarVisible = authStatus;

  const handleStartExploring = () => {
    if (authStatus) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={`flex-1 min-h-screen transition-all duration-300 ${theme === "dark" ? "text-white" : "text-gray-900"} ${isNavbarVisible ? (collapsed ? "ml-16" : "ml-60") : ""}`}>
      {/* HERO */}
      <section className={`pt-44 pb-20 px-6 text-center ${theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-950" : "bg-gradient-to-b from-gray-50 to-white"}`}>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          About <span className="text-blue-500">TwiTube</span>
        </h1>
        <p className={`max-w-3xl mx-auto text-lg leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          TwiTube is a full-stack video platform engineered as a serious backend-first system.
          It blends video sharing, social interaction, and scalable architecture into one learning-driven product.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button
            onClick={handleStartExploring}
            className="bg-blue-600 hover:bg-blue-700 px-7 py-2.5 rounded-xl font-medium transition"
            aria-label="Start exploring the platform - login if needed"
          >
            Start Exploring
          </button>
        </div>
      </section>

      {/* WHY TWITUBE */}
      <section className="px-6 max-w-6xl mx-auto py-20 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Server className="w-8 h-8 text-blue-500" />,
            title: "Backend-First Thinking",
            desc: "Designed around APIs, data models, scalability, and real platform concerns rather than UI-only features."
          },
          {
            icon: <Shield className="w-8 h-8 text-blue-500" />,
            title: "Production-Style Architecture",
            desc: "JWT auth, media pipelines, database relationships, validation layers, and performance-aware design."
          },
          {
            icon: <Sparkles className="w-8 h-8 text-blue-500" />,
            title: "Learning Through Systems",
            desc: "Every feature exists to teach how real products are built, scaled, secured, and evolved."
          }
        ].map((item, i) => (
          <div key={i} className={`rounded-2xl p-6 border transition ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm hover:border-blue-500/40"}`}>
            {item.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2">{item.title}</h3>
            <p className={`leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* WHAT IT OFFERS */}
      <section className="px-6 max-w-6xl mx-auto pb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">
          What TwiTube Brings Together
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className={`rounded-2xl p-8 border ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <Play className="text-blue-500 w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-3">Video Platform Core</h3>
            <ul className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} space-y-2`}>
              <li>• Secure video upload and streaming</li>
              <li>• Metadata, thumbnails, search & discovery</li>
              <li>• Watch history & personalized experience</li>
              <li>• Playlists and structured content flow</li>
            </ul>
          </div>

          <div className={`rounded-2xl p-8 border ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <Globe className="text-blue-500 w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-3">Social Interaction Layer</h3>
            <ul className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} space-y-2`}>
              <li>• Creator profiles and subscriptions</li>
              <li>• Likes, comments, and engagement</li>
              <li>• Tweet-style short content</li>
              <li>• Community-driven discovery</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ENGINEERING */}
      <section className={`${theme === "dark" ? "bg-gray-900/40 border-gray-800" : "bg-gray-50 border-gray-200"} border-y px-6 py-20`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Engineering Philosophy</h2>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} leading-relaxed mb-6`}>
              TwiTube is structured to behave like a real-world system.
              Authentication flows, file pipelines, database modeling, and API contracts are treated as first-class citizens.
            </p>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
              The goal isn’t just to “build features” — it’s to understand why systems are built the way they are,
              where they break, and how they scale.
            </p>
          </div>

          <div className={`rounded-2xl p-8 border ${theme === "dark" ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <Cpu className="text-blue-500 w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-4">Technology Stack</h3>

            <div className={`grid grid-cols-2 gap-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              <div>
                <p className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Frontend</p>
                <p>React + Vite</p>
                <p>Tailwind CSS</p>
                <p>Redux Toolkit</p>
                <p>React Router</p>
              </div>
              <div>
                <p className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Backend</p>
                <p>Node.js & Express</p>
                <p>MongoDB</p>
                <p>JWT Authentication</p>
                <p>Cloudinary Media</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Build. Learn. Explore.</h2>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto mb-10`}>
          TwiTube exists at the intersection of engineering practice and creative experimentation.
          A platform to explore systems, not just screens.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          {!authStatus && (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`px-7 py-2.5 rounded-xl font-medium transition ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}
                aria-label="Log in to your existing account"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 hover:bg-blue-700 px-7 py-2.5 rounded-xl font-medium transition"
                aria-label="Create a new account"
              >
                Create Account
              </button>
            </>
          )}
          <button
            onClick={handleStartExploring}
            className="bg-emerald-600 hover:bg-emerald-700 px-7 py-2.5 rounded-xl font-medium transition"
            aria-label="Explore the video platform - login if needed"
          >
            Browse Platform
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;
