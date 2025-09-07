import React from "react";
import { Link } from "react-router-dom";

export default function NavigationMenu() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex space-x-6 bg-gray-100 p-4">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-blue-600 hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-blue-600 hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
