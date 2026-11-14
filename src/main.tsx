import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element");
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
