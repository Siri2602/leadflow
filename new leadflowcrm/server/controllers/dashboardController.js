const Lead = require('../models/Lead');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { assignedTo: req.user._id };

    const totalLeads = await Lead.countDocuments(filter);
    const activeClients = await Lead.countDocuments({ ...filter, status: { $in: ['Contacted', 'Proposal Sent', 'Negotiation'] } });
    const closedWon = await Lead.countDocuments({ ...filter, status: 'Closed Won' });
    const closedLost = await Lead.countDocuments({ ...filter, status: 'Closed Lost' });
    const conversionRate = totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) : 0;

    const statusCounts = await Lead.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const sourceCounts = await Lead.aggregate([
      { $match: filter },
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    res.json({ totalLeads, activeClients, closedWon, closedLost, conversionRate, statusCounts, sourceCounts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { assignedTo: req.user._id };

    // Monthly leads for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Lead.aggregate([
      { $match: { ...filter, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Closed Won'] }, 1, 0] } },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthlyData.map(item => ({
      month: months[item._id.month - 1],
      leads: item.total,
      won: item.won,
    }));

    res.json({ chartData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
