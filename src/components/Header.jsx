import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUser,
  FaBookmark,
  FaSignOutAlt,
  FaPenFancy,
  FaBlog,
} from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Get profile picture from redux store
  const profilePic =
    user?.profilePicture ||
    "https://res.cloudinary.com/demo/image/upload/v1690000000/default-avatar.png";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNav = (path) => {
    if (isAuthenticated && token) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-12 py-2 bg-white shadow-md border-b">
      <h1
        className="text-2xl font-bold text-gray-800 tracking-tight cursor-pointer"
        onClick={() => handleNav("/home")}
      >
        Insightful Ink
      </h1>
      <div className="flex items-center gap-13">
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition border-0"
          onClick={() => handleNav("/write")}
        >
          <FaPenFancy className="text-lg" />
          Write
        </button>
        {isAuthenticated && token ? (
          <div className="relative" ref={dropdownRef}>
            <img
              src={profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-blue-500"
              onClick={() => setDropdownOpen((open) => !open)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border z-20 py-2">
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-purple-50 text-gray-700 transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  <FaUser className="text-purple-600" />
                  View Profile
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-purple-50 text-gray-700 transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile#bookmarks");
                  }}
                >
                  <FaBookmark className="text-blue-500" />
                  Bookmarks
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-purple-50 text-gray-700 transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile#myblogs");
                  }}
                >
                  <FaBlog className="text-green-600" />
                  My Blogs
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            onClick={() => handleNav("/login")}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
