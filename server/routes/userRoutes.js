const express = require("express");
const router = express.Router();
const {
  getTesting,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} = require("../controller/userController");
const verifyToken = require("../utills/verifyUser");
router.get("/test", getTesting);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);
module.exports = router;
