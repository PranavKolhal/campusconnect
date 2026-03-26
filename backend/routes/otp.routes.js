const express = require('express');
const router = express.Router();
const { sendOTPEmail, verifyOTP } = require('../services/emailService');

// Request OTP
router.post('/request', async (req, res) => {
    console.log('📨 OTP request received:', req.body);
    
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email is required' 
        });
    }
    
    try {
        const result = await sendOTPEmail(email);
        res.json(result);
    } catch (error) {
        console.error('❌ OTP request error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP' 
        });
    }
});

// Verify OTP
router.post('/verify', (req, res) => {
    console.log('🔐 OTP verification received:', req.body);
    
    const { email, otp } = req.body;
    
    if (!email || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and OTP are required' 
        });
    }
    
    const result = verifyOTP(email, otp);
    res.json(result);
});

module.exports = router;