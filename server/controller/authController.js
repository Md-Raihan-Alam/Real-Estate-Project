const errorHandler = require("../utills/error");
const user = require("../models/user");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const validUser = await user.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    // Check if the password is correct
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid email/password!"));
    }

    // Generate JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Destructure the password out of the validUser object to exclude it from response
    const { password: _, ...userWithoutPassword } = validUser._doc;

    // Set the cookie with the JWT token
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        user: userWithoutPassword,
        token,
      });
  } catch (error) {
    next(error); // Pass any other errors to the error handler
  }
};

module.exports = {
  signup,
  signin,
};
