import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./AuthProvider.jsx";
import { AppProvider } from "./AppContext";
import { HashRouter } from "react-router-dom";
import "./index.css";

//  ....com/#/contact

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <AuthProvider>
      <AppProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AppProvider>
    </AuthProvider>
  </HashRouter>
);
