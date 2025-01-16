import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const username = sessionStorage.getItem("name");
  const userRole = sessionStorage.getItem("role");

  if (!username || !userRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;