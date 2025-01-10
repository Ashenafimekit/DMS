const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "email already registered" });

    const newUser = new User({
      name: name,
      email: email,
      password: password,
    });
    await newUser.save();
    console.log("new user registered");
    res.status(201).json({ message: "successfully registered" });
  } catch (error) {
    console.log("unable to signup : ", error);
    res.status(500).json({ message: "server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

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
      console.log("Generated token:", token); // Log the token
    } catch (error) {
      console.error("Error generating token:", error); // Catch and log any errors
    }

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

module.exports = {
  login,
  logout,
  signup,
};
