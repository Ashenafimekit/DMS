const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    // If not super admin or admin role is provided, default to 'user'
    const userRole =
      role && (role === "admin" || role === "member") ? role : "user";

    const newUser = new User({
      name: name,
      email: email,
      password: password,
      role: userRole,
    });

    await newUser.save();
    console.log("New user registered");

    if (userRole === "admin" || "member") {
      // Notify super admin to approve
      return res
        .status(201)
        .json({ message: `${userRole} registration pending approval` });
    }
    res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    console.log("Unable to signup: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isApproved === false)
      return res.status(400).json({ message: "Account is not approved" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    let token;
    try {
      token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );
    } catch (error) {
      console.error("Error generating token:", error); // Catch and log any errors
    }
   // console.log("token : ", token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //(process.env.NODE_ENV = "production"),
      sameSite: "lax", // "lax"
      maxAge: 3600000,
      path: "/",
    });
    res.json({
      message: "Logged in successfully",
      user: { name: user.name, role: user.role },
    });
  } catch (error) {
    console.log("Server Error : ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const approval = async (req, res) => {
  const  userId  = req.params.id;
  try {
    // Verify that the requester is a superadmin
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Access denied. Only superadmins can approve users.",
      });
    }

    // Find the user to be approved
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isApproved = true;
    await user.save();

    res
      .status(200)
      .json({ message: `${user.name} has been approved successfully.` });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const accounts = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "superadmin" } }); // Exclude superadmin
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No accounts found" });
    }

    res.status(200).json({ users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  logout,
  signup,
  approval,
  accounts,
};
