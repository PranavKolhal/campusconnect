// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected route
router.get('/me', authController.verifyToken, authController.getCurrentUser);

// Admin only route
router.get('/users', authController.verifyToken, authController.isAdmin, authController.getAllUsers);

module.exports = router;