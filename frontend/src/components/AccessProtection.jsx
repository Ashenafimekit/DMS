import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

// AccessProtection component to handle role-based redirection
const AccessProtection = ({ children, allowedRoles }) => {
  const username = sessionStorage.getItem("name");
  const userRole = sessionStorage.getItem("role");
  const location = useLocation();
  console.log("location : ", location);

  // If the user is not logged in
  if (!username || !userRole) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // If the user does not have the required role
  if (!allowedRoles.includes(userRole)) {
    setTimeout(() => {
      toast("unauthorized access please use authorized account");
    }, 1000);
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};

export default AccessProtection;
