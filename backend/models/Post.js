const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  _id: { type: String }, // UUID
  user_id: { type: String, ref: 'User', required: true },
  platform: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'draft' },
  scheduled_at: { type: Date, default: null },
  published_at: { type: Date, default: null },
  publish_result: { type: String, default: null },
  media_path: { type: String, default: null },
  media_type: { type: String, default: null },
  campaign_id: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
