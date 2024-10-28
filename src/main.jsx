import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./AuthProvider.jsx";
import { AppProvider } from "./AppContext";
import { BrowserRouter } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import "./index.css";

//  ....com/#/contact

ReactDOM.createRoot(document.getElementById("root")).render(
  <DndProvider backend={HTML5Backend}>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </DndProvider>
);
