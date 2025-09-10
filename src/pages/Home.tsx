import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6 text-gray-900">
      <h1 className="mb-6 text-center text-5xl font-extrabold">U-DIG IT Rentals</h1>
      <p className="mb-8 max-w-2xl text-center text-lg">
        Your trusted platform for finding and managing rentals effortlessly.
      </p>
      <div className="flex space-x-4">
        <a
          href="#rentals"
          className="rounded-xl bg-blue-600 px-6 py-3 text-white shadow transition hover:bg-blue-700"
        >
          Browse Rentals
        </a>
        <Link
          to="/status"
          className="rounded-xl bg-green-600 px-6 py-3 text-white shadow transition hover:bg-green-700"
        >
          System Status
        </Link>
      </div>
    </div>
  );
}
