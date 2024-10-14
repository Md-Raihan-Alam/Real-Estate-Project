const errorHandler = require("../utills/error");
const User = require("../models/user"); // Ensure the correct import of User model
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
    const validUser = await User.findOne({ email }); // Fixed reference
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
    next(error);
  }
};

const google = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // Generate JWT token
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Destructure the password out of the validUser object to exclude it from response
      const { password: _, ...userWithoutPassword } = existingUser._doc;

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
    } else {
      // Generate a random password
      const generatePassword = Math.random().toString(36).slice(-8); // Fixed generation logic
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4), // Generates a random suffix to the username
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save(); // Corrected spelling from 'svae' to 'save'

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Destructure the password out of the newUser object to exclude it from response
      const { password: _, ...userWithoutPassword } = newUser._doc;

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
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  google,
};
