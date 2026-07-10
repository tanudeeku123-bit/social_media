const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Campaign = require('../models/Campaign');
const Post = require('../models/Post');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const campaigns = await Campaign.find({ user_id: req.userId }).sort({ created_at: -1 }).lean();

  const withCounts = await Promise.all(campaigns.map(async (c) => {
    const counts = await Post.aggregate([
      { $match: { campaign_id: c._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const tally = { draft: 0, scheduled: 0, published: 0, failed: 0 };
    for (const row of counts) tally[row._id] = row.count;
    return { ...c, postCounts: tally, totalPosts: Object.values(tally).reduce((a, b) => a + b, 0) };
  }));

  res.json({ campaigns: withCounts });
});

router.post('/', async (req, res) => {
  const { name, goal } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const id = uuidv4();
  await Campaign.create({ _id: id, user_id: req.userId, name, goal: goal || '' });
  const campaign = await Campaign.findById(id).lean();
  res.status(201).json({ campaign });
});

router.put('/:id', async (req, res) => {
  const existing = await Campaign.findOne({ _id: req.params.id, user_id: req.userId });
  if (!existing) return res.status(404).json({ error: 'Campaign not found' });

  const { name, goal } = req.body;
  await Campaign.findByIdAndUpdate(req.params.id, { name: name ?? existing.name, goal: goal ?? existing.goal });
  const campaign = await Campaign.findById(req.params.id).lean();
  res.json({ campaign });
});

router.delete('/:id', async (req, res) => {
  const existing = await Campaign.findOne({ _id: req.params.id, user_id: req.userId });
  if (!existing) return res.status(404).json({ error: 'Campaign not found' });

  await Post.updateMany({ campaign_id: req.params.id }, { campaign_id: null });
  await Campaign.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
