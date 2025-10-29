const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/productControllers");
const { protect } = require("../middleware/authMiddleware");

// The request will first go through 'protect' middleware to verify the user is logged in
router.route("/").post(protect, addProduct).get(getAllProducts);

router.route("/:id").get(getProductById);

module.exports = router;
