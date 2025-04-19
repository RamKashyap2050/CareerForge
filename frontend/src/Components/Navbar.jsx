import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { MdDashboard, MdWork, MdOutlineSmartToy } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { FaLinkedin, FaCode } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer tracking-wide hover:text-blue-400 transition"
          onClick={() => navigate("/")}
        >
          JobGenieX 🚀
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition"
          >
            <MdDashboard size={20} /> Dashboard
          </button>

          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition"
            >
              🧰 Tools ▾
            </button>
            {toolsOpen && (
              <div className="absolute mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                <div className="flex flex-col py-2">
                  <span
                    onClick={() => navigate("/customresume")}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Create Resume
                  </span>
                  <span
                    onClick={() => navigate("/LinkedinProfile")}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    LinkedIn Profile Extractor
                  </span>
                  <span
                    onClick={() => navigate("/mockinterviews")}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Mock Interviews
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setCodeOpen(!codeOpen)}
              className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition"
            >
              💻 Code ▾
            </button>
            {codeOpen && (
              <div className="absolute mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                <div className="flex flex-col py-2">
                  <span
                    onClick={() => navigate("/Problems")}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Problems
                  </span>
                  <span
                    onClick={() => navigate("/jobstrategy")}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Strategy Board
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/joblistings")}
            className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition"
          >
            <MdWork size={20} /> Job Listings
          </button>

          <button
            className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-500 transition"
            onClick={handleLogout}
          >
            <FiLogOut size={20} /> Logout
          </button>
        </div>

        {/* Mobile Button */}
        <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-gray-800 rounded-lg shadow-lg p-4 space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 w-full text-left text-sm font-medium hover:text-blue-400 transition"
          >
            <MdDashboard size={20} /> Dashboard
          </button>
          <button
            onClick={() => navigate("/customresume")}
            className="flex items-center gap-2 w-full text-left text-sm font-medium hover:text-blue-400 transition"
          >
            <AiOutlineFileText size={20} /> Create Resume
          </button>
          <button
            onClick={() => navigate("/LinkedinProfile")}
            className="flex items-center gap-2 w-full text-left text-sm font-medium hover:text-blue-400 transition"
          >
            <FaLinkedin size={20} /> LinkedIn Profile Extractor
          </button>
          <button
            onClick={() => navigate("/mockinterviews")}
            className="flex items-center gap-2 w-full text-left text-sm font-medium hover:text-blue-400 transition"
          >
            <MdOutlineSmartToy size={20} /> Mock Interviews
          </button>
          <button
            onClick={() => navigate("/Problems")}
            className="flex items-center gap-2 w-full text-left text-sm font-medium hover:text-blue-400 transition"
          >
            <FaCode size={20} /> Problems
          </button>
          <button
            onClick={() => navigate("/jobstrategy")}
            className="flex items-center gap-2 w-full text-left text-sm font-medium hover:text-blue-400 transition"
          >
            📌 Strategy Board
          </button>
          <button
            onClick={() => navigate("/joblistings")}
            className="flex items-center gap-2 w-full text-left text-sm font-medium hover:text-blue-400 transition"
          >
            <MdWork size={20} /> Job Listings
          </button>
          <button
            className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-500 transition"
            onClick={handleLogout}
          >
            <FiLogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;