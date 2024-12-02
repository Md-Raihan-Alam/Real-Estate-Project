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
const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if(req.user.id!==listing.userRef){
      return next(errorHandler(403,"You are not authorized to update this listing"));
    }
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
}
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if(req.user.id!==listing.userRef){
      return next(errorHandler(403,"You are not authorized to delete this listing"));
    }
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Listing deleted successfully",success:true });
  } catch (error) {
    next(error);
  }
};
const getListing=async(req,res,next)=>{
  try{
    const listing=await Listing.findById(req.params.id);
    if(!listing)
    {
      return next(errorHandler(404,"Listing not found!"));
    }
    res.status(200).json(listing);
  }catch(error)
  {

  }
}
module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing
};
