import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white-900 text-gray-900 py-10">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
          
          {/* Left - Logo + Description */}
          <div>
            {/* Replace with your logo image */}
            <a href="/" className="flex items-center mb-4">
                <img src="/images/lm-transparent.png" alt="LianaMed" className="h-10 mb-4" />
            </a>
            <p className="max-w-sm text-sm text-gray-700">
              Precision. Reliability. Care — Delivered. Your trusted partner in medical technology.
            </p>
          </div>

          {/* Right - Social Icons */}
          <div className="flex space-x-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-700">© {new Date().getFullYear()} LianaMed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
