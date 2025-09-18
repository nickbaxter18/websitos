import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between bg-white px-6 py-4 shadow-md">
      <Link to="/" className="text-xl font-bold text-blue-700">
        U-DIG IT Rentals
      </Link>
      <div className="flex space-x-6">
        <Link to="/" className="font-medium text-gray-700 transition hover:text-blue-700">
          Home
        </Link>
        <Link to="/status" className="font-medium text-gray-700 transition hover:text-blue-700">
          System Status
        </Link>
      </div>
    </nav>
  );
}
