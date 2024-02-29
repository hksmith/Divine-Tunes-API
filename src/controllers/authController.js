const User = require("../models/user");
const bcrypt = require("bcrypt");

// Signup
const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      favMusic: [],
    });

    // Save the new user
    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Signup failed" });
  }
};

// Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Include the user's role in the response
    const role = user.roles.Admin ? "admin" : "user";

    return res.status(200).json({ message: "Login successful", role });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login failed" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    // Clear the session
    req.session.destroy();

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = { signup, login, logout };
