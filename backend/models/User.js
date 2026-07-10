const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String }, // UUID
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, default: '' },
  default_platforms: { type: [String], default: [] },
  reset_code: { type: String },
  reset_code_expires_at: { type: Date },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
