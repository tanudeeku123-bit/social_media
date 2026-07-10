const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const BrandProfile = require('../models/BrandProfile');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }

  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    _id: id,
    email,
    password_hash: passwordHash,
    name: name || '',
  });

  await BrandProfile.create({ user_id: id });

  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id, email, name: name || '', default_platforms: [] } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name, default_platforms: user.default_platforms || [] },
  });
});

router.put('/platforms', requireAuth, async (req, res) => {
  const { platforms } = req.body;
  if (!Array.isArray(platforms)) {
    return res.status(400).json({ error: 'platforms must be an array' });
  }
  await User.findByIdAndUpdate(req.userId, { default_platforms: platforms });
  res.json({ default_platforms: platforms });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select('email name default_platforms');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user._id, email: user.email, name: user.name, default_platforms: user.default_platforms || [] } });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email' });
  }

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

  user.reset_code = code;
  user.reset_code_expires_at = expiresAt;
  await user.save();

  console.log(`[PASS_RESET_MOCK] Verification code for ${email}: ${code}`);

  res.json({
    success: true,
    message: 'Verification code generated successfully',
    code // Return in response for simulated/demo ease
  });
});

router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Email, verification code, and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.reset_code || user.reset_code !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  if (!user.reset_code_expires_at || user.reset_code_expires_at < new Date()) {
    return res.status(400).json({ error: 'Verification code has expired' });
  }

  // Update password hash
  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.password_hash = passwordHash;
  user.reset_code = undefined;
  user.reset_code_expires_at = undefined;
  await user.save();

  res.json({ success: true, message: 'Password has been reset successfully' });
});

module.exports = router;
