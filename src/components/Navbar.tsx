import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-700">
        U-DIG IT Rentals
      </Link>
      <div className="flex space-x-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-700 transition font-medium"
        >
          Home
        </Link>
        <Link
          to="/status"
          className="text-gray-700 hover:text-blue-700 transition font-medium"
        >
          System Status
        </Link>
      </div>
    </nav>
  );
}