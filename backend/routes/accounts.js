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

function getMockProfileDetails(platform, handle) {
  const cleanHandle = handle.replace('@', '').trim();
  if (cleanHandle.toLowerCase() === 'tani_sha_1210' || cleanHandle.toLowerCase() === 'thiriveni_12') {
    return {
      profile_name: cleanHandle.toLowerCase() === 'tani_sha_1210' ? 'Tanisha' : 'Thiriveni',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      followers_count: 1240,
      following_count: 482,
      posts_count: 42,
      bio: 'Social Media Organizer & Scrapbook Enthusiast ✨',
    };
  }
  
  const randomFollowers = Math.floor(Math.random() * 5000) + 150;
  const randomFollowing = Math.floor(Math.random() * 800) + 100;
  return {
    profile_name: cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1),
    avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanHandle}`,
    followers_count: randomFollowers,
    following_count: randomFollowing,
    posts_count: Math.floor(Math.random() * 50) + 5,
    bio: `Content Creator on ${platform.toUpperCase()} 🚀`,
  };
}

router.post('/', async (req, res) => {
  const { platform, handle, app_password } = req.body;

  if (!platform || !SUPPORTED_PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: `Platform must be one of: ${SUPPORTED_PLATFORMS.join(', ')}` });
  }
  if (!handle) {
    return res.status(400).json({ error: 'Handle is required' });
  }
  if (!app_password || app_password.trim().length < 4) {
    return res.status(400).json({ error: 'Account Password / App Password is required' });
  }

  // Simulate verification delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const profile = getMockProfileDetails(platform, handle);

  const id = uuidv4();
  await SocialAccount.create({
    _id: id,
    user_id: req.userId,
    platform,
    handle: handle.replace('@', '').trim(),
    app_password: '[SECURED_MOCK_TOKEN]', // Do not store plaintext passwords
    profile_name: profile.profile_name,
    avatar_url: profile.avatar_url,
    followers_count: profile.followers_count,
    following_count: profile.following_count,
    posts_count: profile.posts_count,
    bio: profile.bio,
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
