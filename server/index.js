const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const listingRouter = require("./routes/listingRoutes");
const errorInfo = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
dotenv.config();
// mongoose.connect(
//   ""
// );
const app = express();
const port = process.env.PORT || 5000;
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
