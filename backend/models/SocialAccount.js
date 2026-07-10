const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  _id: { type: String }, // UUID
  user_id: { type: String, ref: 'User', required: true },
  platform: { type: String, required: true },
  handle: { type: String, required: true },
  status: { type: String, default: 'connected' },
  app_password: { type: String, default: null },
  profile_name: { type: String, default: null },
  avatar_url: { type: String, default: null },
  followers_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },
  posts_count: { type: Number, default: 0 },
  bio: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
