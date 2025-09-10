import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Status from "./pages/Status";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router basename="/websitos">
      <div className="flex flex-col min-h-screen">
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
                <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700">
                  <h1 className="text-3xl font-bold mb-4">⚠️ Route Not Found</h1>
                  <p className="mb-2">React Router attempted to load an unknown route.</p>
                  <p className="text-sm opacity-70">Check <code>App.tsx</code> and Router basename configuration.</p>
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