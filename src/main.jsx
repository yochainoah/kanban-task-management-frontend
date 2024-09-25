import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./AuthProvider.jsx";
import { AppProvider } from "./AppContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
);
