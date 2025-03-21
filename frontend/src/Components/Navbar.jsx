import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { MdDashboard, MdWork, MdOutlineSmartToy } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>CareerForge</h1>
      
      <div className="hidden md:flex space-x-6">
        <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => navigate("/dashboard")}>
          <MdDashboard size={20} /> Dashboard
        </button>
        <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => navigate("/customresume")}>
          <AiOutlineFileText size={20} /> Create Resume
        </button>
        <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => navigate("/mockinterviews")}>
          <MdOutlineSmartToy size={20} /> Mock Interviews
        </button>
        <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => navigate("/joblistings")}>
          <MdWork size={20} /> Job Listings
        </button>
        <button className="flex items-center gap-2 hover:text-red-400" onClick={handleLogout}>
          <FiLogOut size={20} /> Logout
        </button>
      </div>
      
      {/* Mobile Menu Button */}
      <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
        {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>
      
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-6 w-48 bg-gray-800 rounded-lg shadow-lg flex flex-col space-y-4 p-4 md:hidden">
          <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => navigate("/dashboard")}>
            <MdDashboard size={20} /> Dashboard
          </button>
          <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => navigate("/customresume")}>
            <AiOutlineFileText size={20} /> Create Resume
          </button>
          <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => navigate("/mockinterviews")}>
            <MdOutlineSmartToy size={20} /> Mock Interviews
          </button>
          <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => navigate("/joblistings")}>
            <MdWork size={20} /> Job Listings
          </button>
          <button className="flex items-center gap-2 text-red-400 hover:text-red-500" onClick={handleLogout}>
            <FiLogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
