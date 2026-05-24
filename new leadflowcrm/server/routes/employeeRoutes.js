const express = require('express');
const router = express.Router();
const { getPerformance } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/performance', protect, getPerformance);

module.exports = router;
