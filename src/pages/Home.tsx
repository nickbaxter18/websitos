import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900 p-6">
      <h1 className="text-5xl font-extrabold mb-6 text-center">
        U-DIG IT Rentals
      </h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        Your trusted platform for finding and managing rentals effortlessly.
      </p>
      <div className="flex space-x-4">
        <a
          href="#rentals"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Browse Rentals
        </a>
        <Link
          to="/status"
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          System Status
        </Link>
      </div>
    </div>
  );
}