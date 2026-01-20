import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaHeart,
  FaEnvelope,
} from "react-icons/fa";
import { FcCamcorderPro } from "react-icons/fc";

export default function Footer() {
  const theme = useSelector((state) => state.theme.theme);
  const collapsed = useSelector((state) => state.navbar.collapsed);
  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const location = useLocation();

  if (["/login", "/register", "/addVideo", "/addTweet"].includes(location.pathname)) return null;

  const quickLinks = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" },
    { name: "Subscriptions", path: "/subscription" },
    { name: "Add Video", path: "/addVideo" },
  ];

  const socialLinks = [
    { icon: FaGithub, url: "https://github.com/shubham4268", label: "GitHub" },
    { icon: FaTwitter, url: "https://x.com/shubs4268", label: "Twitter" },
    {
      icon: FaLinkedin,
      url: "https://linkedin.com/in/shubhamjoshi10/",
      label: "LinkedIn",
    },
    { icon: FaYoutube, url: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer
      className={`w-full transition-all duration-300   ${user ? (collapsed ? "w-[calc(100%-4rem)]" : " w-[calc(100%-14rem)] scale-90 ml-[76px] pl-20") : ""
        } ${theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white border-t border-white/10"
          : "bg-gradient-to-t from-slate-300 to-slate-200 text-gray-900 border-t border-gray-200"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/Logo.png" alt="TwiTube Logo" className="w-12 h-12" />
              <div
                className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
              >
                Twi<span className="text-blue-600">Tube</span>
              </div>
            </div>
            <p
              className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Your ultimate platform for sharing and discovering amazing video
              content. Connect with creators and explore endless entertainment.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${theme === "dark"
                    ? "bg-gray-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 text-gray-300 hover:text-white"
                    : "bg-gray-200 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 text-gray-600 hover:text-white"
                    }`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-all duration-300 hover:translate-x-1 inline-block ${theme === "dark"
                      ? "text-gray-400 hover:text-indigo-400"
                      : "text-gray-600 hover:text-indigo-600"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                }`}
            >
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`text-sm transition-all duration-300 hover:translate-x-1 inline-block ${theme === "dark"
                    ? "text-gray-400 hover:text-indigo-400"
                    : "text-gray-600 hover:text-indigo-600"
                    }`}
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm transition-all duration-300 hover:translate-x-1 inline-block ${theme === "dark"
                    ? "text-gray-400 hover:text-indigo-400"
                    : "text-gray-600 hover:text-indigo-600"
                    }`}
                >
                  Community Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm transition-all duration-300 hover:translate-x-1 inline-block ${theme === "dark"
                    ? "text-gray-400 hover:text-indigo-400"
                    : "text-gray-600 hover:text-indigo-600"
                    }`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm transition-all duration-300 hover:translate-x-1 inline-block ${theme === "dark"
                    ? "text-gray-400 hover:text-indigo-400"
                    : "text-gray-600 hover:text-indigo-600"
                    }`}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                }`}
            >
              Stay Updated
            </h3>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <FaEnvelope
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${theme === "dark"
                    ? "bg-gray-800 border border-white/10 text-white placeholder-gray-500"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                />
              </div>
              <button
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${theme === "dark"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white"
                  : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white"
                  }`}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"
            }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              © {new Date().getFullYear()} TwiTube. All rights reserved.
            </p>
            <p
              className={`text-sm flex items-center space-x-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>by Shubham Joshi</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
