// Handles publishing posts to connected platforms.
//
// Bluesky is the only platform with a real implementation here (using
// @atproto/api with an App Password). All other platforms remain
// simulated until you register developer apps with each platform.
//
// Bluesky setup:
//   1. Create an App Password at https://bsky.app/settings/app-passwords
//   2. Set BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD in .env
//
// For real publishing to X, Instagram, etc., you'll need:
//   X (Twitter):  https://developer.twitter.com/
//   LinkedIn:     https://www.linkedin.com/developers/
//   Meta (IG/FB): https://developers.facebook.com/
//   TikTok:       https://developers.tiktok.com/

const { Agent, CredentialSession, RichText } = require('@atproto/api');

// Cache agents by identifier/handle to handle multiple personal accounts
const blueskyAgentsCache = {};

async function getBlueskyAgent(account) {
  // Use account-specific app_password if available, otherwise global env
  const identifier = account && account.app_password ? account.handle : process.env.BLUESKY_IDENTIFIER;
  const password = account && account.app_password ? account.app_password : process.env.BLUESKY_APP_PASSWORD;

  if (!identifier || !password) {
    return null;
  }

  const cached = blueskyAgentsCache[identifier];
  // Reuse the existing agent if the session is still fresh (within 23 hours)
  if (cached && Date.now() < cached.expiry) {
    return cached.agent;
  }

  try {
    const session = new CredentialSession(new URL('https://bsky.social'));
    await session.login({ identifier, password });

    const agent = new Agent(session);
    // Cache for 23 hours (sessions last 24h)
    blueskyAgentsCache[identifier] = {
      agent,
      expiry: Date.now() + 23 * 60 * 60 * 1000
    };
    return agent;
  } catch (err) {
    console.error(`Bluesky login failed for ${identifier}:`, err.message);
    return null;
  }
}

async function publishToBluesky(post, account) {
  const agent = await getBlueskyAgent(account);

  if (!agent) {
    return {
      success: false,
      message: 'Bluesky credentials not configured or login failed. Set BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD in .env to enable real publishing.',
    };
  }

  try {
    const rt = new RichText({ text: post.content || '' });
    await rt.detectFacets(agent);

    const response = await agent.post({
      text: rt.text,
      facets: rt.facets,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      externalId: response.uri,
      message: `Published to Bluesky at ${response.uri}`,
    };
  } catch (err) {
    return {
      success: false,
      message: `Bluesky publish failed: ${err.message}`,
    };
  }
}

async function publishToInstagram(post, account) {
  return simulate('instagram', post, account);
}

async function publishToTikTok(post, account) {
  return simulate('tiktok', post, account);
}

async function publishToX(post, account) {
  return simulate('x', post, account);
}

async function publishToLinkedIn(post, account) {
  return simulate('linkedin', post, account);
}

async function publishToFacebook(post, account) {
  return simulate('facebook', post, account);
}

async function publishToYoutube(post, account) {
  return simulate('youtube', post, account);
}

async function simulate(platform, post, account) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    success: true,
    externalId: `simulated-${platform}-${Date.now()}`,
    message: `Simulated publish to ${platform} as @${account.handle}. Connect real API credentials in .env to go live.`,
  };
}

const PUBLISHERS = {
  instagram: publishToInstagram,
  tiktok: publishToTikTok,
  x: publishToX,
  linkedin: publishToLinkedIn,
  facebook: publishToFacebook,
  youtube: publishToYoutube,
  bluesky: publishToBluesky,
};

async function publish(post, account) {
  const fn = PUBLISHERS[post.platform];
  if (!fn) {
    return { success: false, message: `Unsupported platform: ${post.platform}` };
  }
  try {
    return await fn(post, account);
  } catch (err) {
    return { success: false, message: err.message };
  }
}

module.exports = { publish };
