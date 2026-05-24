const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// GET /api/leads
exports.getLeads = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, assignedTo } = req.query;
    const query = {};
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    // BDA employees can only see their own leads
    if (req.user.role === 'bda') query.assignedTo = req.user._id;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ leads, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/leads/:id
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/leads
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({ ...req.body });
    await Activity.create({
      action: 'Lead Created',
      description: `New lead "${lead.clientName}" from ${lead.companyName || 'Unknown'} was created`,
      user: req.user._id,
      lead: lead._id,
      type: 'lead_created',
    });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/leads/:id
exports.updateLead = async (req, res) => {
  try {
    const existing = await Lead.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Lead not found' });
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo', 'name email');
    let actType = 'lead_updated';
    let desc = `Lead "${lead.clientName}" was updated`;
    if (req.body.status && req.body.status !== existing.status) {
      actType = 'status_changed';
      desc = `Lead "${lead.clientName}" status changed from ${existing.status} to ${lead.status}`;
    }
    await Activity.create({ action: 'Lead Updated', description: desc, user: req.user._id, lead: lead._id, type: actType });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/leads/:id
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
