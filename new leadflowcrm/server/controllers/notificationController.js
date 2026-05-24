const Lead = require('../models/Lead');

exports.getNotifications = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };

    const upcoming = await Lead.find({
      ...filter,
      followUpDate: { $gte: today, $lte: nextWeek },
      status: { $nin: ['Closed Won', 'Closed Lost'] }
    }).populate('assignedTo', 'name').sort({ followUpDate: 1 }).limit(10);

    const overdue = await Lead.find({
      ...filter,
      followUpDate: { $lt: today },
      status: { $nin: ['Closed Won', 'Closed Lost'] }
    }).populate('assignedTo', 'name').sort({ followUpDate: -1 }).limit(10);

    res.json({ upcoming, overdue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
