const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");
const userRouter = require("./routes/userRoutes");
dotenv.config();
// mongoose.connect(
//   ""
// );
const app = express();
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {});
app.use("/api/user", userRouter);
const start = async () => {
  try {
    // await connectDB(process.env.MONGO_URL);
    app.listen(3000, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
