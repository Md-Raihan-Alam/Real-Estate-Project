const User = require("../models/user");
const getTesting = async (req, res) => {
  res.status(200).json({ msg: "testing" });
};
module.exports = {
  getTesting,
};
