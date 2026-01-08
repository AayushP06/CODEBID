import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// ✅ add this import (adjust path/name to match your file)
import { AuctionProvider } from "./context/AuctionContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ✅ wrap App so all views can use the backend state + websocket */}
    <AuctionProvider>
      <App />
    </AuctionProvider>
  </StrictMode>
);
