const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  clientName: { type: String, required: true, trim: true },
  companyName: { type: String, trim: true },
  email: { type: String, lowercase: true },
  phone: { type: String },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Cold Call', 'Email Campaign', 'LinkedIn', 'Trade Show', 'Other'],
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'New'
  },
  notes: { type: String },
  followUpDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: { type: Number, default: 0 },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
