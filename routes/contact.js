const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const Visitor = require('../models/Visitor');

const router = express.Router();

// Middleware to track visitors
const trackVisitor = async (req, res, next) => {
  try {
    const visitor = new Visitor({
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      page: req.path,
      referrer: req.get('Referrer'),
      sessionId: req.headers['x-session-id'] || 'anonymous'
    });
    await visitor.save();
  } catch (error) {
    console.error('Visitor tracking error:', error);
  }
  next();
};

// Apply visitor tracking to all routes
router.use(trackVisitor);

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Save message
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    await contactMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

module.exports = router;