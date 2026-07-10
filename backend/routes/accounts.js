const express = require('express');
const { v4: uuidv4 } = require('uuid');
const SocialAccount = require('../models/SocialAccount');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const SUPPORTED_PLATFORMS = [
  'instagram', 'tiktok', 'x', 'linkedin', 'facebook', 'youtube',
  'discord', 'reddit', 'pinterest', 'bluesky', 'tumblr', 'threads', 'snapchat',
];

router.get('/', async (req, res) => {
  const accounts = await SocialAccount.find({ user_id: req.userId }).sort({ created_at: 1 }).lean();
  res.json({ accounts, supported_platforms: SUPPORTED_PLATFORMS });
});

router.post('/', async (req, res) => {
  const { platform, handle, app_password } = req.body;

  if (!platform || !SUPPORTED_PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: `Platform must be one of: ${SUPPORTED_PLATFORMS.join(', ')}` });
  }
  if (!handle) {
    return res.status(400).json({ error: 'Handle is required' });
  }

  const id = uuidv4();
  await SocialAccount.create({
    _id: id,
    user_id: req.userId,
    platform,
    handle,
    app_password: app_password || null
  });

  const account = await SocialAccount.findById(id).lean();
  res.status(201).json({ account });
});

router.delete('/:id', async (req, res) => {
  const result = await SocialAccount.deleteOne({ _id: req.params.id, user_id: req.userId });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json({ success: true });
});

module.exports = router;
