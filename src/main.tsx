import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

// Add Vite types for import.meta.env
/// <reference types="vite/client" />

console.log("🚀 React app starting with basename:", import.meta.env.BASE_URL);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL || "/websitos"}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
