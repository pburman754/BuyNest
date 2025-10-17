const Shop = require("../models/shopModel");
const User = require("../models/userModel");

const createShop = async (req, res) => {
  try {
    const { name, description } = req.body;
    const shopExists = await Shop.findOne({ owner: req.user._id });
    if (shopExists) {
      return res.status(400).json({ message: "You already own a shop" });
    }

    const shop = new Shop({
      name,
      description,
      owner: req.user._id,
    });

    const createdShop = await shop.save();

    await User.findByIdAndUpdate(req.user._id, { isSeller: true });
    res.status(201).json(createdShop);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createShop };
