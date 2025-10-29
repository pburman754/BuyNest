const express = require('express');
const router = express.Router();
const { createShop } = require('../controllers/shopControllers');
const { protect } = require('../middleware/authMiddleware');

// Any request to this route must first pass through the 'protect' middleware
router.post('/', protect, createShop);

module.exports = router; 