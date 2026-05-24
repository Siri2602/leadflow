const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const activities = await Activity.find(filter)
      .populate('user', 'name email')
      .populate('lead', 'clientName companyName')
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
