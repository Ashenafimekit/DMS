import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [changeButton, setChangeButton] = useState(false);
  const name = sessionStorage.getItem("name");

  const handleMenu = () => {
    setOpenMenu(!openMenu);
    setChangeButton(!changeButton);
  };

  const handleLogout = async() => {
    sessionStorage.removeItem("name");
    window.location.reload();

    try {
      const res = await axios.post('http://localhost:3000/auth/logout')
      toast.success(res.data.message)
    } catch (error) {
      console.log("error : ", error);
      toast.error("server error")
    }
  };
  return (
    <div className="flex flex-row items-center justify-around py-5 bg-primary text-text ">
      <div className="">
        <Link to="/">
          <h1 className="text-2xl font-bold">DMS</h1>
        </Link>
      </div>
      <div className="flex flex-row">
        <div
          className={`text-lg font-semibold md:flex md:flex-row md:gap-10 ${
            openMenu ? "flex flex-col" : "hidden"
          }  md:flex `}
        >
          <Link to="/"><h1>Home</h1></Link>
          <Link><h1>Investment</h1></Link>
          <Link><h1>My Investment</h1></Link>
          <Link><h1>Profile</h1></Link>

          <div className="">
            {name ? (
              <div className="flex flex-col items-center md:-mt-4 cursor-pointer ">
                <span>{name}</span>
                <button className="-mt-1" onClick={handleLogout}>Logout</button>
                <ToastContainer/>
              </div>
            ) : (
              <Link to="/login">
                Login <LoginIcon />
              </Link>
            )}
          </div>
        </div>

        <div className={`md:hidden `}>
          <button
            onClick={handleMenu}
            className={`${changeButton ? "hidden" : "flex"}`}
          >
            <MenuIcon />
          </button>
          <button
            onClick={handleMenu}
            className={`${changeButton ? "flex" : "hidden"}`}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
