const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');

// ===================== REGISTER =====================
const registerController = async (req, res) => {
  try {
    const { userName, email, password, phone, address } = req.body;

    // Validate input fields
    if (!userName || !email || !password || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered, please login",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error in register API",
      error: error.message,
    });
  }
};

// ===================== LOGIN =====================
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // token
    const token = JWT.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn: "7d",
    })   // encrypt-> sign() decrypt-> verify()   _id-> default id created for each user in the database
    user.password = undefined; // hides the password completely (in postman api)

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error in login API",
      error: error.message,
    });
  }
};

module.exports = { registerController, loginController };
