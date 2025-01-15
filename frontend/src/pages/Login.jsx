import axios from "axios";
import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [users, setUsers] = useState({
    email: "",
    password: "",
  });
  const [passVisible, setPassVissible] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUsers({
      ...users,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user : ", users);

    try {
      await axios
        .post("http://localhost:3000/auth/login", users, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.message);
          toast.success(res.data.message);
          console.log("User Role : ", res.data.user.role);
          console.log("User name : ", res.data.user.name);
          sessionStorage.setItem("role", res.data.user.role);
          sessionStorage.setItem("name", res.data.user.name);
          setInterval(() => {
            navigate("/admin");
          }, 3000);
        });
    } catch (error) {
      console.log("Error : ", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning(error.response.data.message);
        }
        if (error.response.status === 401) {
          toast.warning(error.response.data.message);
        }
        if (error.response.status === 403) {
          toast.warning(error.response.data.message);
        }
        if (error.response.status === 500) {
          const errorMessage =
            error.response.data.message || "Internal Server Error";
          toast.error(errorMessage);
        }
      } else {
        toast.error("Unable to login");
      }
    }
  };

  return (
    <div className="bg-[#F0F8FF] flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center rounded bg-white pt-4 px-20 pb-20">
        <div className="">{toast && <ToastContainer autoClose={2000} />}</div>
        <h1 className="text-3xl">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-8 w-64">
          <input
            className="outline-none border border-black py-1 px-2"
            onChange={handleChange}
            name="email"
            value={users.email}
            type="email"
            placeholder="Email"
          />
          <div className="relative">
            <input
              className="outline-none border border-black py-1 px-2 w-full"
              onChange={handleChange}
              name="password"
              value={users.password}
              type={`${passVisible ? "text" : "password"}`}
              placeholder="Password"
            />
            <button
              className="absolute right-1 top-1"
              onClick={(e) => setPassVissible(!passVisible)}
              type="button"
            >
              <span className={`${passVisible ? "hidden" : "flex"}`}>
                <VisibilityIcon fontSize="small" />
              </span>
              <span className={`${passVisible ? "flex" : "hidden"}`}>
                <VisibilityOffIcon fontSize="small" />
              </span>{" "}
            </button>
          </div>

          <button
            type="submit"
            className="bg-primary p-2 text-text text-lg font-semibold"
          >
            Login
          </button>
          <div className="px-4 text-center">
            <h1>
              Don't have an account?
              <Link to="/signup" className="text-blue-500 font-semibold ml-1">
                signup
              </Link>
            </h1>
            <h1>
              <Link to="/" className="text-blue-500 text-center">
                back
              </Link>
            </h1>
          </div>
        </form>
        <div className="">{role && <span>user role : {role}</span>}</div>
      </div>
    </div>
  );
};

export default Login;
