const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authController = require('../controllers/auth.controller');

// All admin routes are protected and require admin role
router.use(authController.verifyToken);
router.use(authController.isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Event management
router.get('/events', adminController.getAllEvents);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/verifications', adminController.getPendingVerifications);
router.post('/verify/:userId', adminController.verifyOrganizer);

// Reports
router.get('/reports/revenue', adminController.getRevenueReport);

module.exports = router;