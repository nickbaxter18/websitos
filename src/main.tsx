import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary.js";

// Add Vite types for import.meta.env
/// <reference types="vite/client" />

console.log("🚀 React app starting with basename:", import.meta.env.BASE_URL);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
