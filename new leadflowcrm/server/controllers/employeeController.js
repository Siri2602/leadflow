const Lead = require('../models/Lead');
const User = require('../models/User');

exports.getPerformance = async (req, res) => {
  try {
    const employees = await User.find({ role: 'bda' }).select('name email');
    const performance = await Promise.all(employees.map(async (emp) => {
      const total = await Lead.countDocuments({ assignedTo: emp._id });
      const won = await Lead.countDocuments({ assignedTo: emp._id, status: 'Closed Won' });
      const active = await Lead.countDocuments({ assignedTo: emp._id, status: { $in: ['Contacted', 'Proposal Sent', 'Negotiation'] } });
      const rate = total > 0 ? ((won / total) * 100).toFixed(1) : 0;
      return { employee: emp, totalLeads: total, closedWon: won, activeLeads: active, conversionRate: rate };
    }));
    res.json(performance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
