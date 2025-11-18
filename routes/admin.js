const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

// Simple admin credentials (in production, use proper user management)
const ADMIN_EMAIL = 'aronnosaha161.dopamine@gmail.com';
// Pre-computed hash for '@Ronna$1618151311181514141.dopamine' - change this password in production!
const ADMIN_PASSWORD_HASH = '$2a$10$UP/Q6twvkQwZ5xWf0tiJ0.Ofj0KNFTTP9VdGAdyNq2yb/w07NZElW';

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// POST /api/admin/login - Send verification email
router.post('/login', async (req, res) => {
  console.log('=== ADMIN LOGIN REQUEST ===');
  console.log('Request body:', req.body);

  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, passwordProvided: !!password });

    // Verify credentials first
    if (email !== ADMIN_EMAIL || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ Credentials valid, creating verification token');

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Store token in memory (use Redis in production)
    global.verificationTokens = global.verificationTokens || new Map();
    global.verificationTokens.set(verificationToken, {
      email: ADMIN_EMAIL,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      used: false
    });

    console.log('✅ Verification token created');

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/api/admin/verify/${verificationToken}`;

    const mailOptions = {
      from: `"Aronna Saha Portfolio" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: 'Admin Login Verification - Aronna Saha Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Admin Login Verification</h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; color: #333;">
              Someone requested access to your portfolio admin panel.
            </p>

            <p style="margin: 0 0 15px 0; color: #666;">
              If this was you, click the button below to verify your login:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="background-color: #4F46E5; color: white; padding: 12px 24px;
                        text-decoration: none; border-radius: 6px; font-weight: bold;
                        display: inline-block;">
                Verify Login
              </a>
            </div>

            <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">
              This link will expire in 15 minutes for security reasons.
            </p>

            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              If you didn't request this login, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>Aronna Saha - Portfolio Admin</p>
          </div>
        </div>
      `
    };

    console.log('📧 Sending verification email...');

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Verification email sent. Please check your email and click the verification link.'
    });

  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email. Please try again later.'
    });
  }
});

// GET /api/admin/messages - Get all contact messages (admin only)
router.get('/messages', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;

    let filter = {};
    if (status === 'read') filter.isRead = true;
    if (status === 'unread') filter.isRead = false;

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContactMessage.countDocuments(filter);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// PUT /api/admin/messages/:id/read - Mark message as read (admin only)
router.put('/messages/:id/read', verifyAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      data: message,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// DELETE /api/admin/messages/:id - Delete message (admin only)
router.delete('/messages/:id', verifyAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET /api/admin/stats - Get admin dashboard stats (admin only)
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalMessages = await ContactMessage.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ isRead: false });
    const totalProjects = await require('../models/Project').countDocuments();

    // Recent messages
    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email message createdAt isRead');

    res.json({
      success: true,
      data: {
        totalMessages,
        unreadMessages,
        totalProjects,
        recentMessages
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET /api/admin/verify/:token - Verify custom token and login
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Check custom verification token
    global.verificationTokens = global.verificationTokens || new Map();
    const tokenData = global.verificationTokens.get(token);

    if (!tokenData || tokenData.used || tokenData.expires < Date.now()) {
      return res.redirect(`${process.env.FRONTEND_URL}/admin/login?error=invalid_token`);
    }

    // Mark token as used
    tokenData.used = true;
    global.verificationTokens.set(token, tokenData);

    // Generate JWT token for admin login
    const jwtToken = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/admin/login?token=${jwtToken}&verified=true`);

  } catch (error) {
    console.error('Token verification error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/admin/login?error=verification_failed`);
  }
});

// POST /api/admin/test-email - Test email configuration (remove in production)
router.post('/test-email', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection
    await transporter.verify();

    const testMailOptions = {
      from: `"Test Email" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Email Test - Portfolio Admin',
      html: '<h1>Email configuration is working!</h1><p>This is a test email.</p>'
    };

    const info = await transporter.sendMail(testMailOptions);

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email test failed: ' + error.message,
      error: error.code
    });
  }
});

module.exports = router;