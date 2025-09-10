import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-600 py-6 mt-8 border-t">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">© {new Date().getFullYear()} U-DIG IT Rentals. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="/privacy"
            className="hover:text-blue-600 transition text-sm"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-blue-600 transition text-sm"
          >
            Terms of Service
          </a>
          <a
            href="mailto:support@udigit.io"
            className="hover:text-blue-600 transition text-sm"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}