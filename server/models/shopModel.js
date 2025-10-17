const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId, // This creates the link
      required: true,
      ref: 'User', // It refers to the 'User' model
      unique: true, // One user can only own one shop
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: false, // A logo is optional initially
      default: '/images/default_logo.png', // A placeholder image
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;