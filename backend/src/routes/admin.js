'use strict';

const express = require('express');
const router = express.Router();
const { getDashboard, getAdminProducts, getAdminOrders, getAdminUsers, getAnalytics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/products', getAdminProducts);
router.get('/orders', getAdminOrders);
router.get('/users', getAdminUsers);
router.get('/analytics', getAnalytics);

module.exports = router;
