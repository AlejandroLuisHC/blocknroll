import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import "./utils/fontLoader";
import App from "./App";

// Get the root element and ensure it exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure you have a div with id='root' in your HTML."
  );
}

// Modern scroll animations
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((el) => observer.observe(el));
};

// Initialize animations after DOM loads
const handleDOMLoaded = () => {
  // Small delay to ensure all components are rendered
  setTimeout(initScrollAnimations, 100);
};

// Create and render the React app
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Initialize scroll animations
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", handleDOMLoaded);
} else {
  handleDOMLoaded();
}
