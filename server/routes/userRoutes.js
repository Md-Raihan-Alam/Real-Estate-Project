const express = require("express");
const router = express.Router();
const { getTesting } = require("../controller/userController");
router.get("/test", getTesting);
module.exports = router;
