const cron = require("node-cron");
const NewsArticle = require("../Models/NewsArticle");
const facebookService = require("./facebookService");
const AppConfig = require("../Models/AppConfig");
const User = require("../Models/user.model");

/**
 * Trigger Facebook auto-post when a scheduled article goes live.
 */
async function triggerFacebookPost(newsItem) {
    if (newsItem.status !== "published") return;

    try {
        let pageId, pageAccessToken;

        // 1. Try global system-level config first
        const globalConfig = await AppConfig.findOne({ key: "facebook" });
        if (globalConfig?.facebook?.pageId && globalConfig?.facebook?.autoPostEnabled) {
            pageId = globalConfig.facebook.pageId;
            pageAccessToken = globalConfig.facebook.pageAccessToken;
        } else if (newsItem.authorId) {
            const user = await User.findById(newsItem.authorId);
            if (user?.facebook?.pageId) {
                pageId = user.facebook.pageId;
                pageAccessToken = user.facebook.pageAccessToken;
            }
        }

        if (!pageId || !pageAccessToken) {
            console.log("[Facebook Scheduler] Auto-post skipped: No Facebook Page connected.");
            return;
        }

        const articleUrl = `https://www.timecybermedia.com/Pages/${newsItem.category}/${newsItem.subCategory || newsItem.category}/${newsItem.slug}`;
        const message = `📰 ${newsItem.title}\n\n${newsItem.summary || ""}\n\nRead more 👇`;

        const result = await facebookService.postToPage(pageId, pageAccessToken, message, articleUrl, newsItem.image);
        if (result.success) {
            console.log(`[Facebook Scheduler] ✅ Auto-posted scheduled news: "${newsItem.title}" → Post ID: ${result.postId}`);
        } else {
            console.error(`[Facebook Scheduler] ❌ Auto-post failed: ${result.error}`);
        }
    } catch (error) {
        console.error("[Facebook Scheduler] triggerFacebookPost Error:", error);
    }
}

/**
 * Checks for scheduled news articles whose scheduled time has passed and publishes them.
 */
async function checkAndPublishScheduledNews() {
    try {
        const now = new Date();
        const dueArticles = await NewsArticle.find({
            status: "scheduled",
            scheduledAt: { $lte: now }
        });

        if (!dueArticles || dueArticles.length === 0) {
            return;
        }

        console.log(`[Scheduler] ⏰ Found ${dueArticles.length} scheduled article(s) ready for publishing.`);

        for (const article of dueArticles) {
            try {
                article.status = "published";
                article.publishedAt = now;
                article.isHidden = false;
                await article.save();

                console.log(`[Scheduler] 🚀 Published: "${article.title}" (${article.slug})`);

                // Auto post to Facebook
                triggerFacebookPost(article);
            } catch (itemErr) {
                console.error(`[Scheduler] ❌ Error publishing article ${article._id}:`, itemErr.message);
            }
        }
    } catch (err) {
        console.error("[Scheduler] Error in checkAndPublishScheduledNews:", err.message);
    }
}

/**
 * Starts the cron job to run every minute
 */
function initScheduler() {
    console.log("[Scheduler] 🕒 Initializing News Scheduling Cron Service (runs every minute)...");

    // Run every minute: '* * * * *'
    cron.schedule("* * * * *", () => {
        checkAndPublishScheduledNews();
    });

    // Also run an initial check right on startup
    checkAndPublishScheduledNews();
}

module.exports = {
    initScheduler,
    checkAndPublishScheduledNews
};
