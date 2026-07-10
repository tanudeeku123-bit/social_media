const express = require('express');
const BrandProfile = require('../models/BrandProfile');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const profile = await BrandProfile.findOne({ user_id: req.userId }).lean();
  res.json({ profile });
});

router.put('/', async (req, res) => {
  const { tone, audience, rules, sample_posts } = req.body;

  await BrandProfile.findOneAndUpdate(
    { user_id: req.userId },
    { tone: tone || '', audience: audience || '', rules: rules || '', sample_posts: sample_posts || '', updated_at: new Date() },
    { upsert: true }
  );

  const profile = await BrandProfile.findOne({ user_id: req.userId }).lean();
  res.json({ profile });
});

module.exports = router;
