import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../AuthProvider.jsx"; // Import your auth context or logic

const ProtectedRoute = ({ children }) => {
  console.log("useAuth",useAuth());
  const { isAuthenticated } = useAuth(); // Get auth status

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
