import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-2 bg-white border-t flex justify-center items-center">
      <span className="text-gray-500 text-sm">
        Crafted with <span className="text-red-500">♥</span> & code — Insightful
        Ink © {new Date().getFullYear()}
      </span>
    </footer>
  );
};

export default Footer;
