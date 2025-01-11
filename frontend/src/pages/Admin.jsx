import React from "react";
import { Outlet } from "react-router-dom";
import Dashboard from "../components/Dashboard";


const Admin = () => {  
  return (
    <div className="flex flex-row justify-start ">
      <div className="w-52">
        <Dashboard />
      </div>
      <div className=" w-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
