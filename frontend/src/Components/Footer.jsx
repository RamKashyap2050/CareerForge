import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Branding and Info */}
        <div>
          <h2 className="text-2xl font-bold">Career Forge</h2>
          <p className="mt-3 text-gray-300 text-sm leading-relaxed">
            Your pathway to the next great job opportunity. Build, refine, and
            optimize resumes powered by AI. Tailored resumes. Curated job listings. 
            All in one place. Transform your job search with ease.
          </p>
        </div>

        {/* Right Side: Links */}
        <div className="md:text-right">
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
            </li>
            <li>
              <a href="#about" className="text-gray-400 hover:text-white transition">About Us</a>
            </li>
            <li>
              <a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a>
            </li>
            <li>
              <a href="#privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Career Forge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
