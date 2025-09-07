import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Components
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

function App() {
  return (
    <Router basename="/websitos">
      <div className="flex min-h-screen flex-col">
        {/* Navigation */}
        <nav className="bg-slate-900 px-6 py-4 text-white shadow-md">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="font-medium transition-colors hover:text-amber-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="font-medium transition-colors hover:text-amber-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="font-medium transition-colors hover:text-amber-400">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms" className="font-medium transition-colors hover:text-amber-400">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="font-medium transition-colors hover:text-amber-400">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Pages */}
        <main className="flex-grow bg-slate-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
