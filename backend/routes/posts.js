const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Post = require('../models/Post');
const BrandProfile = require('../models/BrandProfile');
const SocialAccount = require('../models/SocialAccount');
const { requireAuth } = require('../middleware/auth');
const { generatePosts } = require('../services/aiService');
const { publish } = require('../services/publishService');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { status, campaign_id, from, to } = req.query;
  const filter = { user_id: req.userId };

  if (status) filter.status = status;
  if (campaign_id) filter.campaign_id = campaign_id;

  if (from || to) {
    const rangeFilter = {};
    if (from) rangeFilter.$gte = new Date(from);
    if (to) rangeFilter.$lte = new Date(to);
    // Mirrors the original SQL: COALESCE(scheduled_at, published_at) IN range
    // i.e. use scheduled_at if set, otherwise published_at
    filter.$or = [
      { scheduled_at: null, published_at: null },
      {
        $or: [
          { $and: [{ scheduled_at: { $ne: null } }, { scheduled_at: rangeFilter }] },
          { $and: [{ scheduled_at: null }, { published_at: rangeFilter }] },
        ],
      },
    ];
  }

  const posts = await Post.find(filter).sort({ created_at: -1 }).lean();
  res.json({ posts });
});

router.post('/generate', async (req, res) => {
  const { idea, platforms } = req.body;

  if (!idea || !Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ error: 'idea (string) and platforms (non-empty array) are required' });
  }

  let brandProfile = await BrandProfile.findOne({ user_id: req.userId }).lean();
  if (!brandProfile) brandProfile = { tone: '', audience: '', rules: '', sample_posts: '' };

  try {
    const posts = await generatePosts({ idea, platforms, brandProfile });
    res.json({ posts });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { platform, content, scheduled_at, media_path, media_type, campaign_id } = req.body;
  if (!platform || !content) {
    return res.status(400).json({ error: 'platform and content are required' });
  }

  const id = uuidv4();
  const status = scheduled_at ? 'scheduled' : 'draft';

  await Post.create({
    _id: id,
    user_id: req.userId,
    platform,
    content,
    status,
    scheduled_at: scheduled_at || null,
    media_path: media_path || null,
    media_type: media_type || null,
    campaign_id: campaign_id || null,
  });

  const post = await Post.findById(id).lean();
  res.status(201).json({ post });
});

router.put('/:id', async (req, res) => {
  const existing = await Post.findOne({ _id: req.params.id, user_id: req.userId });
  if (!existing) return res.status(404).json({ error: 'Post not found' });
  if (existing.status === 'published') {
    return res.status(400).json({ error: 'Cannot edit a post that has already been published' });
  }

  const { content, scheduled_at, platform, media_path, media_type, campaign_id } = req.body;
  const status = scheduled_at ? 'scheduled' : 'draft';

  const update = {};
  if (content !== undefined) update.content = content;
  if (scheduled_at !== undefined) update.scheduled_at = scheduled_at;
  if (platform !== undefined) update.platform = platform;
  update.status = status;
  if (media_path !== undefined) update.media_path = media_path;
  if (media_type !== undefined) update.media_type = media_type;
  if (campaign_id !== undefined) update.campaign_id = campaign_id;

  await Post.findByIdAndUpdate(req.params.id, update);

  const post = await Post.findById(req.params.id).lean();
  res.json({ post });
});

router.post('/:id/publish-now', async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, user_id: req.userId });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const account = await SocialAccount.findOne({ user_id: req.userId, platform: post.platform });
  if (!account) {
    return res.status(400).json({ error: `No connected ${post.platform} account. Connect one first.` });
  }

  const result = await publish(post.toObject(), account.toObject());

  await Post.findByIdAndUpdate(post._id, {
    status: result.success ? 'published' : 'failed',
    published_at: new Date(),
    publish_result: result.message,
  });

  const updated = await Post.findById(post._id).lean();
  res.json({ post: updated, result });
});

router.delete('/:id', async (req, res) => {
  const result = await Post.deleteOne({ _id: req.params.id, user_id: req.userId });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Post not found' });
  res.json({ success: true });
});

module.exports = router;
