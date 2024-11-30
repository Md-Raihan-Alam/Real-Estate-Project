const express = require("express");
const { createListing,deleteListing } = require("../controller/listingController");
const verifyToken = require("../utills/verifyUser");

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
module.exports = router;
