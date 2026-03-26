const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure transporter with Brevo using environment variables
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY
    }
});

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Send OTP email
async function sendOTPEmail(email) {
    console.log('📧 Generating OTP for:', email);
    
    const otp = generateOTP();
    console.log('🔢 Generated OTP:', otp);
    
    // Store with 10-minute expiry
    otpStore.set(email, {
        code: otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
        attempts: 0
    });
    
    // Email content
    const mailOptions = {
        from: '"CampusConnect" <pranavkolhal72@gmail.com>',
        to: email,
        subject: 'Your CampusConnect Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h2 style="color: #6366f1; text-align: center;">CampusConnect Verification</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">Your verification code is:</p>
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: white;">${otp}</span>
                </div>
                <p style="color: #666; font-size: 14px;">This code expires in <strong>10 minutes</strong>. Never share this code with anyone.</p>
                <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">© 2026 CampusConnect. All rights reserved.</p>
            </div>
        `
    };
    
    try {
        console.log('📤 Sending email via Brevo...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, message: 'Failed to send OTP. Check SMTP settings.' };
    }
}

// Verify OTP
function verifyOTP(email, enteredOTP) {
    console.log('🔍 Verifying OTP for:', email);
    
    const stored = otpStore.get(email);
    
    if (!stored) {
        console.log('❌ No OTP found for:', email);
        return { success: false, message: 'OTP not found. Request new one.' };
    }
    
    if (Date.now() > stored.expiresAt) {
        console.log('❌ OTP expired for:', email);
        otpStore.delete(email);
        return { success: false, message: 'OTP expired. Request new one.' };
    }
    
    stored.attempts++;
    if (stored.attempts > 3) {
        console.log('❌ Too many attempts for:', email);
        otpStore.delete(email);
        return { success: false, message: 'Too many failed attempts. Request new OTP.' };
    }
    
    if (stored.code === enteredOTP) {
        console.log('✅ OTP verified successfully for:', email);
        otpStore.delete(email);
        return { success: true, message: 'Verified successfully!' };
    } else {
        console.log('❌ Invalid OTP for:', email);
        return { success: false, message: 'Invalid OTP. Try again.' };
    }
}

// Test function
async function testEmailConnection() {
    try {
        await transporter.verify();
        console.log('✅ Brevo SMTP connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Brevo SMTP connection failed:', error);
        return false;
    }
}

// Export all functions
module.exports = { 
    sendOTPEmail, 
    verifyOTP, 
    testEmailConnection 
};
