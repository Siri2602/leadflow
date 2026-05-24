const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  type: {
    type: String,
    enum: ['lead_created', 'lead_updated', 'lead_assigned', 'status_changed', 'login', 'note_added'],
    default: 'lead_updated'
  },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
