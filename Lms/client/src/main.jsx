import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import App from "./App";
import { AppContextProvider } from "./context/AppContext";

import "./index.css";
import "./App.css";

// Clerk publishable key from .env
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Safety check
if (!clerkKey) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkKey}
      navigate={(to) => window.history.pushState(null, "", to)}
    >
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);