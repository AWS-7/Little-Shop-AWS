import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Error handling for debugging
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
  document.body.innerHTML = '<div style="padding: 20px; font-family: system-ui;"><h1>Error: Root element not found</h1></div>';
} else {
  try {
    console.log("Mounting React app...");
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("React app mounted successfully");
  } catch (error) {
    console.error("Failed to mount React app:", error);
    rootElement.innerHTML = `<div style="padding: 20px; font-family: system-ui;">
      <h1>Failed to load application</h1>
      <p style="color: red;">${error.message}</p>
      <pre>${error.stack}</pre>
    </div>`;
  }
}
