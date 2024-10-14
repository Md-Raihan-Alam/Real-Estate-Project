const express = require("express");
const router = express.Router();
const { signup, signin, google } = require("../controller/authController");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
module.exports = router;
