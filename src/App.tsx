import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Status from "./pages/Status";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router basename="/websitos">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Home />} />

            {/* Status Dashboard */}
            <Route path="/status" element={<Status />} />

            {/* Debug Catch-All */}
            <Route
              path="*"
              element={
                <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 text-red-700">
                  <h1 className="mb-4 text-3xl font-bold">⚠️ Route Not Found</h1>
                  <p className="mb-2">React Router attempted to load an unknown route.</p>
                  <p className="text-sm opacity-70">
                    Check <code>App.tsx</code> and Router basename configuration.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
