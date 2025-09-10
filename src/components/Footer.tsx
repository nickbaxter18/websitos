import React from "react";

export default function Footer() {
  return (
    <footer className="mt-8 w-full border-t bg-gray-100 py-6 text-gray-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-4 md:flex-row">
        <p className="text-sm">
          © {new Date().getFullYear()} U-DIG IT Rentals. All rights reserved.
        </p>
        <div className="mt-4 flex space-x-6 md:mt-0">
          <a href="/privacy" className="text-sm transition hover:text-blue-600">
            Privacy Policy
          </a>
          <a href="/terms" className="text-sm transition hover:text-blue-600">
            Terms of Service
          </a>
          <a href="mailto:support@udigit.io" className="text-sm transition hover:text-blue-600">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
