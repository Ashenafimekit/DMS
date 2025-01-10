import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = Cookies.get("authToken");
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decoded = jwt_decode(token);
  if (decoded.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
