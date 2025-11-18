const express = require('express');
const Visitor = require('../models/Visitor');

const router = express.Router();

// GET /api/analytics/visitors - Get visitor statistics (admin only)
router.get('/visitors', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get total visitors
    const totalVisitors = await Visitor.countDocuments({
      timestamp: { $gte: startDate }
    });

    // Get unique visitors (by IP)
    const uniqueVisitors = await Visitor.distinct('ip', {
      timestamp: { $gte: startDate }
    });

    // Get page views by page
    const pageViews = await Visitor.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get daily visitors for chart
    const dailyVisitors = await Visitor.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get top referrers
    const topReferrers = await Visitor.aggregate([
      { $match: { timestamp: { $gte: startDate }, referrer: { $ne: null } } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalVisitors,
        uniqueVisitors: uniqueVisitors.length,
        pageViews,
        dailyVisitors,
        topReferrers,
        period
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET /api/analytics/realtime - Get recent visitors (admin only)
router.get('/realtime', async (req, res) => {
  try {
    const recentVisitors = await Visitor.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('ip page timestamp userAgent');

    res.json({
      success: true,
      data: recentVisitors
    });

  } catch (error) {
    console.error('Realtime analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;