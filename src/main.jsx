import { StrictMode } from "react"; // Import StrictMode for extra checks and warnings in development
import { createRoot } from "react-dom/client"; // Import createRoot to render the app with React 18's root API
import "./index.css"; // Import global CSS for the app
import App from "./App.jsx"; // Import the main App component

// Create the root element and render the App component inside StrictMode
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App /> {/* Main application component */}
  </StrictMode>
);
