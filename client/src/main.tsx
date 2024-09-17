import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";
import App from "@/App.tsx";

export const API_BASE_URL = "https://vwh-upload.yazanemails.workers.dev";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <main className="container mx-auto">
      <div className="mt-8 flex h-full flex-col items-center gap-6">
        <a href="/">
          <img
            draggable={false}
            src="/logo.webp"
            className="h-28 w-28"
            alt="Vite logo"
            title="Logo"
          />
        </a>
        <App />
        <footer className="flex flex-col text-center text-primary">
          <span>
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
  </React.StrictMode>
);
