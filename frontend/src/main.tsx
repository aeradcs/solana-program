import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { WalletContextProvider } from "./contexts/WalletContextProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WalletContextProvider>
      <Router>
        <App />
      </Router>
    </WalletContextProvider>
  </StrictMode>
);
