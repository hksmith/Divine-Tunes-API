const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const crypto = require('crypto');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(express.json());
app.use(cors());

// Session middleware
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to 'true' if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
    },
  })
);

// Routes
const musicRoutes = require("./src/routes/music-route");
const authRoutes = require("./src/routes/auth-route");
const userRoutes = require("./src/routes/user-route");

app.use("/playlist", musicRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// MongoDB Atlas Connection
const mongoURI = process.env.MONGODBURI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    // Start the server once the connection is established
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB Atlas:", error);
  });
