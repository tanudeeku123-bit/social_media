const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  _id: { type: String }, // UUID
  user_id: { type: String, ref: 'User', required: true },
  platform: { type: String, required: true },
  handle: { type: String, required: true },
  status: { type: String, default: 'connected' },
  app_password: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
