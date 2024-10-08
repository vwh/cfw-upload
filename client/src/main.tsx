import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Link } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import App from "@/App.tsx";

export const API_BASE_URL = "https://files.vwh.sh/api";
export const CDN_BASE_URL = "https://cdn.vwh.sh";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <main className="noise container mx-auto">
        <div className="overlay" />
        <div className="z-20 mt-8 flex h-full w-full flex-col items-center gap-6">
          <Link to="/">
            <img
              draggable={false}
              src="/logo.webp"
              className="h-28 w-28 transition-transform duration-300 hover:scale-105"
              alt="Vite logo"
              title="Logo"
            />
          </Link>
          <App />
          <footer className="flex flex-col text-center text-primary">
            <span className="text-sm text-primary/70">
              Serverless temp files upload service, anonymously and free.
            </span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/vwh/vwh-upload"
              className="hover:underline"
            >
              <strong>
                Made with <span className="animate-pulse">💙</span> by @vwh
              </strong>
            </a>
          </footer>
        </div>
        <Toaster />
      </main>
    </Router>
  </React.StrictMode>
);
