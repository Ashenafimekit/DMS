import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import TableViewIcon from "@mui/icons-material/TableView";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const [username, setUsername] = useState(sessionStorage.getItem("name"));
  const [userRole, setUserRole] = useState(sessionStorage.getItem("role"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("role");
    setUsername(null);
    setUserRole(null);
    try {
      const res = await axios.post("http://localhost:3000/auth/logout");
      toast.success(res.data.message);
      console.log("logout message : ", res.data.message);
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("error:", error);
      toast.error("server error");
    }
  };

  return (
    <div className="flex flex-col justify-between  bg-blue-500 h-screen w-52 text-white ">
      <div className="">
        <div className="flex items-center justify-center p-5 bg-blue-600 ">
          <h1 className="font-bold text-2xl">
            <Link to="/admin">DMS</Link>
          </h1>
        </div>
        <ToastContainer />
        <div className="flex flex-col p-4 gap-1 text-lg">
          <h1 className="hover:bg-blue-600 p-2">
            <Link to="profile">
              <AssignmentIndIcon /> Monitor Profile
            </Link>
          </h1>
          <h1 className="hover:bg-blue-600 p-2">
            <Link to="">
              <AddIcon /> Create Project
            </Link>
          </h1>
          <h1 className="hover:bg-blue-600 p-2">
            <Link to="">
              <TableViewIcon /> Manage Project
            </Link>
          </h1>
          <h1 className="hover:bg-blue-600 p-2">
            <Link to="">
              <BookIcon /> Participation
            </Link>
          </h1>
          <h1 className="hover:bg-blue-600 p-2">
            <Link to="accounts">
              <PersonIcon /> Account
            </Link>
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-center mb-5">
        {username ? (
          <div className="flex flex-col items-center justify-start">
            <span>{username}</span>
            <button onClick={handleLogout} className="hover:bg-blue-600 px-3">
              <LogoutIcon />
            </button>
          </div>
        ) : (
          <Link to="/">LOGIN</Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
