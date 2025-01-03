const User = require("../models/user");
const Listing = require("../models/listing");
const errorHandler = require("../utills/error");
const bcrypt = require("bcryptjs");
const getTesting = async (req, res) => {
  res.status(200).json({ msg: "testing" });
};
const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User had been deleted");
  } catch (error) {
    next(error);
  }
};

const getUserListings=async(req,res,next)=>{

  if(req.user.id!==req.params.id){
    return next(errorHandler(401,"You can only view your own listings!"));
  }
  try{
    const listings=await Listing.find({userRef:req.params.id});
    res.status(200).json(listings);
  }catch(error){
    next(error);
  }
}
const getUser=async(req,res,next)=>{
 
  try{
    const user=await User.findById(req.params.id);
    if(!user)
    {
      return next(errorHandler(404,"User not found!"));
    }
    const {password,...rest}=user._doc;
    res.status(200).json(rest);
  }catch(error)
  {
    next(error);
  }
}
module.exports = {
  getTesting,
  updateUser,
  deleteUser,
  getUserListings,
  getUser
};
