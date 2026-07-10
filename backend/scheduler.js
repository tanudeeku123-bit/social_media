const cron = require('node-cron');
const Post = require('./models/Post');
const SocialAccount = require('./models/SocialAccount');
const { publish } = require('./services/publishService');

function startScheduler() {
  cron.schedule('* * * * *', async () => {
    const duePosts = await Post.find({
      status: 'scheduled',
      scheduled_at: { $lte: new Date() },
    }).lean();

    for (const post of duePosts) {
      const account = await SocialAccount.findOne({ user_id: post.user_id, platform: post.platform }).lean();

      if (!account) {
        await Post.findByIdAndUpdate(post._id, {
          status: 'failed',
          publish_result: `No connected ${post.platform} account`,
        });
        continue;
      }

      const result = await publish(post, account);
      await Post.findByIdAndUpdate(post._id, {
        status: result.success ? 'published' : 'failed',
        published_at: new Date(),
        publish_result: result.message,
      });
    }
  });

  console.log('Scheduler started: checking for due posts every minute.');
}

module.exports = { startScheduler };
