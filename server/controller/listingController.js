const Listing = require("../models/listing");
const errorHandler = require("../utills/error");
const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if(req.user.id!==listing.userRef){
      return next(errorHandler("You are not authorized to delete this listing",403));
    }
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Listing deleted successfully",success:true });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createListing,
  deleteListing
};
