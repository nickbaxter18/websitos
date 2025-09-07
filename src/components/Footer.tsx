import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-700 bg-slate-900 py-10 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-amber-400">Website OS V2</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Cultivating cultural ecosystems with speed ⚡, compliance 🔒, and beauty 🎨 built in.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="transition-colors hover:text-amber-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-amber-400">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms" className="transition-colors hover:text-amber-400">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="transition-colors hover:text-amber-400">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Stay Updated</h3>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:flex-1"
            />
            <button type="submit" className="btn-gold w-full px-6 py-2 sm:w-auto">
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-xs text-slate-500">No spam. Cancel anytime.</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Website OS V2. All rights reserved.
      </div>
    </footer>
  );
}
