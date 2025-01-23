import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Accounts from "./components/Accounts";
import AccessProtection from "./components/AccessProtection";
import Organization from "./components/Organization";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="organization" element={<Organization />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="accounts"
            element={
              <AccessProtection  allowedRoles={["admin", "superadmin"]}>
                <Accounts />
              </AccessProtection>
            }
          />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
