const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const listingRouter = require("./routes/listingRoutes");
const errorInfo = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for the specific client
const cors = require("cors");

const allowedOrigins = [
  "https://real-estate-project-gold.vercel.app",
  "http://localhost:5173", // Local development origin
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent with the request
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use(errorInfo);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
