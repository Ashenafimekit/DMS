import axios from "axios";
import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const [users, setUsers] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member", // Default role
  });
  const [passVisible, setPassVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUsers({
      ...users,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    const userData = {
      name: users.name,
      email: users.email,
      password: users.password,
      role: users.role, // Include role
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/signup",
        userData
      );
      if (res.status === 201) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning(error.response.data.message);
        }
        if (error.response.status === 500) {
          const errorMessage =
            error.response.data.message || "Internal Server Error";
          toast.error(errorMessage);
        }
      } else {
        toast.error("Unable to signup");
      }
    }
  };

  const validation = () => {
    if (
      !users.name ||
      !users.email ||
      !users.password ||
      !users.confirmPassword
    ) {
      toast.error("All fields are required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(users.email)) {
      toast.error("Invalid email format");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordRegex.test(users.password)) {
      toast.error(
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character"
      );
      return false;
    }

    if (users.password !== users.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  return (
    <div className="bg-[#F0F8FF] flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center rounded bg-white pt-4 px-20 pb-20">
        <div className="">{toast && <ToastContainer autoClose={2000} />}</div>
        <h1 className="text-3xl">Signup</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-8 w-64">
          <input
            className="outline-none border border-black py-1 px-2"
            onChange={handleChange}
            name="name"
            value={users.name}
            type="text"
            placeholder="Full Name"
          />
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
              onClick={() => setPassVisible(!passVisible)}
              type="button"
            >
              {passVisible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </button>
          </div>
          <div className="relative">
            <input
              className="outline-none border border-black py-1 px-2 w-full"
              type={`${confirmVisible ? "text" : "password"}`}
              placeholder="Confirm Password"
              onChange={handleChange}
              name="confirmPassword"
              value={users.confirmPassword}
            />
            <button
              className="absolute right-1 top-1"
              onClick={() => setConfirmVisible(!confirmVisible)}
              type="button"
            >
              {confirmVisible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </button>
          </div>
          <select
            className="outline-none border border-black py-1 px-2"
            onChange={handleChange}
            name="role"
            value={users.role}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-primary p-2 text-text text-lg font-semibold"
          >
            Signup
          </button>
          <div className="px-4 text-center">
            <h1>
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 font-semibold">
                Login
              </Link>
            </h1>
            {/* <h1>
              <Link to="/" className="text-blue-500 text-center">
                Back
              </Link>
            </h1> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
