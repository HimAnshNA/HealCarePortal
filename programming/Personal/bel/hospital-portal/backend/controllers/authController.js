const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      role,
      specialization,
      experience,
    });

    res.json({ message: "User registered successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password." });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password." });
    }


    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is NOT set on the server!");
      return res.status(500).json({
        message: "Server config error: JWT_SECRET is missing.",
      });
    }

  
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization || "",
      experience: user.experience || 0,
    };

    return res.json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Internal server error during login.",
      error: err.message,
    });
  }
};
