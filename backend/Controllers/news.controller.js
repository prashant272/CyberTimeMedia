const NewsArticle = require("../Models/NewsArticle");
const User = require("../Models/user.model");
const AppConfig = require("../Models/AppConfig");
const facebookService = require("../Services/facebookService");
const imageService = require("../Services/imageService");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config/config.env" });
const { uploadToR2 } = require('../Utils/cloudflareR2');

/**
 * Trigger Facebook auto-post when an article is published.
 * Priority: 1) Global AppConfig  2) Per-user facebook config
 */
async function triggerFacebookPost(newsItem) {
  if (newsItem.status !== "published") return;

  try {
    let pageId, pageAccessToken;

    // 1. Try global system-level config first (works for ALL articles including AI Bot)
    const globalConfig = await AppConfig.findOne({ key: "facebook" });
    if (globalConfig?.facebook?.pageId && globalConfig?.facebook?.autoPostEnabled) {
      pageId = globalConfig.facebook.pageId;
      pageAccessToken = globalConfig.facebook.pageAccessToken;
      console.log(`[Facebook] Using global config for auto-post: ${globalConfig.facebook.pageName}`);
    }
    // 2. Fallback: per-user credentials (manual articles with authorId)
    else if (newsItem.authorId) {
      const user = await User.findById(newsItem.authorId);
      if (user?.facebook?.pageId) {
        pageId = user.facebook.pageId;
        pageAccessToken = user.facebook.pageAccessToken;
        console.log(`[Facebook] Using per-user config for auto-post: user ${newsItem.authorId}`);
      }
    }

    if (!pageId || !pageAccessToken) {
      console.log("[Facebook] Auto-post skipped: No Facebook Page connected.");
      return;
    }

    const articleUrl = `https://www.timecybermedia.com/Pages/${newsItem.category}/${newsItem.subCategory || newsItem.category}/${newsItem.slug}`;
    const message = `📰 ${newsItem.title}\n\n${newsItem.summary || ""}\n\nRead more 👇`;

    const result = await facebookService.postToPage(pageId, pageAccessToken, message, articleUrl, newsItem.image);
    if (result.success) {
      console.log(`[Facebook] âœ… Auto-posted: "${newsItem.title}" â†’ Post ID: ${result.postId}`);
    } else {
      console.error(`[Facebook] âŒ Auto-post failed: ${result.error}`);
    }
  } catch (error) {
    console.error("[Facebook] triggerFacebookPost Error:", error);
  }
}


exports.AddNews = async (req, res) => {
  try {
    const {
      title, slug, category, subCategory, summary, content,
      image, tags = [], section, targetLink, nominationLink,
      author, status, authorId, scheduledAt
    } = req.body;

    const finalCategory = (category || section)?.toLowerCase();

    if (!title || !slug || !finalCategory || !content) {
      return res.status(400).json({
        success: false,
        msg: "Missing required fields: title, slug, category, content",
      });
    }

    const existing = await NewsArticle.findOne({ slug });
    if (existing) {
      return res.status(409).json({
        success: false,
        msg: `Slug '${slug}' already exists.`,
      });
    }

    let imageUrl = null;
    if (image) {
      if (image.startsWith("http")) {
        imageUrl = image;
      } else {
        try {
          const uploadResponse = await uploadToR2(image, {
            folder: "timecyber_news"
          });
          imageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
          console.error("R2 Upload Error:", uploadError);
        }
      }
    }

    // Apply branding (Newsroom Title Overlay & Logo) whenever image and title are provided
    if (imageUrl && title) {
      const isAlreadyBranded = typeof imageUrl === "string" && (imageUrl.includes("timecyber_news/branded") || imageUrl.includes("branded_"));
      if (!isAlreadyBranded) {
        try {
          const brandedBuffer = await imageService.brandImageWithTitle(imageUrl, title, {
            category: finalCategory
          });
          if (brandedBuffer) {
            const uploadBranded = await uploadToR2(brandedBuffer, {
              folder: "timecyber_news/branded",
              contentType: "image/jpeg",
              extension: "jpg"
            });
            if (uploadBranded?.secure_url) {
              imageUrl = uploadBranded.secure_url;
            }
          }
        } catch (brandErr) {
          console.error("[Image Branding Error in AddNews]:", brandErr.message);
        }
      }
    }

    let articleStatus = status || "draft";
    let parsedScheduledAt = null;

    if (articleStatus === "scheduled") {
      if (scheduledAt) {
        parsedScheduledAt = new Date(scheduledAt);
        // If scheduled time has already passed, publish immediately!
        if (parsedScheduledAt <= new Date()) {
          articleStatus = "published";
        }
      } else {
        articleStatus = "draft";
      }
    }

    const isPublished = articleStatus === "published";

    const newItem = new NewsArticle({
      title, slug, category: finalCategory, subCategory: subCategory || null,
      summary: summary || null, content, image: imageUrl, tags,
      targetLink: targetLink || null, nominationLink: nominationLink || null,
      author: author || "Time Cyber Media",
      authorId: authorId || null,
      status: articleStatus,
      scheduledAt: parsedScheduledAt,
      isHidden: articleStatus === "scheduled" ? true : false,
      publishedAt: isPublished ? new Date() : null
    });

    await newItem.save();

    // Trigger Facebook auto-post if published
    if (isPublished) {
      triggerFacebookPost(newItem);
    }

    return res.status(201).json({
      success: true,
      news: newItem,
      section: finalCategory,
      msg: `News added to ${finalCategory} successfully`,
    });
  } catch (error) {
    console.error("Add News Error:", error);
    res.status(500).json({ success: false, msg: "Server error adding news", error: error.message });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const { includeDrafts, page = 1, limit = 10 } = req.query;
    const query = {};

    if (includeDrafts !== 'true') {
      query.status = 'published';
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const news = await NewsArticle.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await NewsArticle.countDocuments(query);

    res.status(200).json({
      success: true,
      news,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      count: news.length,
      msg: "All news fetched successfully",
    });
  } catch (error) {
    console.error("Get All News Error:", error);
    res.status(500).json({ success: false, msg: "Error fetching news", error: error.message });
  }
};

/**
 * Streams news articles as NDJSON for progressive loading.
 */
exports.streamNews = async (req, res) => {
  try {
    const { includeDrafts, section, limit = 150 } = req.query;
    const query = {};

    if (includeDrafts !== 'true') query.status = 'published';
    if (section) query.category = section;

    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const cursor = NewsArticle.find(query)
      .select('title slug category subCategory summary image tags isLatest isTrending isHidden targetLink nominationLink author publishedAt _id')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean()
      .cursor();

    cursor.on('data', (doc) => {
      res.write(JSON.stringify(doc) + '\n');
    });

    cursor.on('end', () => {
      res.end();
    });

    cursor.on('error', (err) => {
      console.error("Stream Error:", err);
      res.status(500).end();
    });

  } catch (error) {
    console.error("Stream News Init Error:", error);
    res.status(500).json({ success: false, msg: "Error starting stream" });
  }
};

exports.getNewsBySlug = async (req, res) => {
  try {
    const { section, slug } = req.params;
    const { includeDrafts } = req.query;

    // Search by slug first (since slugs are unique)
    let item = await NewsArticle.findOne({ slug }).populate("authorId", "name ProfilePicture designation");

    if (!item) {
      return res.status(404).json({ success: false, msg: `News not found` });
    }

    // Check if it belongs to the section if provided, but don't strictly fail if it's the right slug
    // This handles cases where URLs might have slightly different category names
    if (section && item.category !== section && !["all", "news", "Pages"].includes(section)) {
      console.log(`Note: Article found by slug '${slug}' but category mismatch: expected '${section}', found '${item.category}'`);
    }

    if (includeDrafts !== 'true' && item.status !== 'published') {
      return res.status(404).json({ success: false, msg: `News is in Draft` });
    }

    res.status(200).json({ success: true, news: item, section: item.category, msg: "News fetched" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error fetching news" });
  }
};

exports.getSectionNews = async (req, res) => {
  try {
    const { section } = req.params;
    const { includeDrafts, page = 1, limit = 10 } = req.query;

    const query = { category: section };
    if (includeDrafts !== 'true') query.status = 'published';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sectionNews = await NewsArticle.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await NewsArticle.countDocuments(query);

    res.status(200).json({
      success: true,
      news: sectionNews,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      count: sectionNews.length,
      totalNews: total,
      msg: `${section.toUpperCase()} news fetched`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNewsBySlug = async (req, res) => {
  try {
    const { section, slug } = req.params;
    const result = await NewsArticle.findOneAndDelete({ slug });
    if (!result) return res.status(404).json({ success: false, msg: `No news found` });
    res.status(200).json({ success: true, deletedCount: 1, section, msg: `Deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error deleting news" });
  }
};

exports.updateNewsBySlug = async (req, res) => {
  try {
    const { section, slug } = req.params;
    const updateData = req.body;
    const item = await NewsArticle.findOne({ slug });
    if (!item) return res.status(404).json({ success: false, msg: `News not found` });

    let imageUrl = item.image;
    if (updateData.image && updateData.image !== imageUrl) {
      if (!updateData.image.startsWith("http")) {
        const uploadResponse = await uploadToR2(updateData.image, { folder: "timecyber_news" });
        imageUrl = uploadResponse.secure_url;
      }
      updateData.image = imageUrl;
    }

    // Handle status transitions and scheduling
    if (updateData.status === "scheduled") {
      if (updateData.scheduledAt) {
        updateData.scheduledAt = new Date(updateData.scheduledAt);
        // If scheduled time has already passed, publish immediately
        if (updateData.scheduledAt <= new Date()) {
          updateData.status = "published";
          updateData.publishedAt = new Date();
          updateData.isHidden = false;
        } else {
          updateData.isHidden = true;
        }
      } else {
        updateData.status = "draft";
      }
    } else if (updateData.status === "published") {
      if (item.status !== "published" && !item.publishedAt) {
        updateData.publishedAt = new Date();
      }
      updateData.isHidden = false;
      updateData.scheduledAt = null;
    } else if (updateData.status === "draft" || updateData.status === "archived") {
      updateData.scheduledAt = null;
    }

    // Normalize category if provided
    if (updateData.category) {
      updateData.category = updateData.category.toLowerCase();
    }

    // Apply branding (Newsroom Title Overlay & Logo) whenever an image exists and is not yet branded
    if (imageUrl) {
      const isAlreadyBranded = typeof imageUrl === "string" && (imageUrl.includes("timecyber_news/branded") || imageUrl.includes("branded_"));
      const isNewImage = updateData.image && updateData.image !== item.image;

      if (!isAlreadyBranded || isNewImage) {
        try {
          const titleToUse = updateData.title || item.title;
          const categoryToUse = (updateData.category || item.category)?.toLowerCase();
          const brandedBuffer = await imageService.brandImageWithTitle(imageUrl, titleToUse, {
            category: categoryToUse
          });
          if (brandedBuffer) {
            const uploadBranded = await uploadToR2(brandedBuffer, {
              folder: "timecyber_news/branded",
              contentType: "image/jpeg",
              extension: "jpg"
            });
            if (uploadBranded?.secure_url) {
              imageUrl = uploadBranded.secure_url;
              updateData.image = imageUrl;
            }
          }
        } catch (brandErr) {
          console.error("[Image Branding Error in updateNewsBySlug]:", brandErr.message);
        }
      }
    }

    const updatedItem = await NewsArticle.findOneAndUpdate({ slug }, { ...updateData }, { new: true });

    // Trigger Facebook auto-post if status just changed to published
    if (updateData.status === "published" && item.status !== "published") {
      triggerFacebookPost(updatedItem);
    }

    return res.status(200).json({ success: true, news: updatedItem, section: updatedItem.category, msg: "Updated successfully" });
  } catch (error) {
    console.error("Update News Error:", error);
    res.status(500).json({ success: false, msg: "Error updating news" });
  }
};

exports.setNewsFlags = async (req, res) => {
  try {
    const { section, slug } = req.params;
    const { isLatest, isTrending, isHidden } = req.body;
    const updateFields = {};
    if (typeof isLatest !== "undefined") updateFields.isLatest = !!isLatest;
    if (typeof isTrending !== "undefined") updateFields.isTrending = !!isTrending;
    if (typeof isHidden !== "undefined") updateFields.isHidden = !!isHidden;

    const updatedItem = await NewsArticle.findOneAndUpdate({ slug }, { $set: updateFields }, { new: true });
    if (!updatedItem) return res.status(404).json({ success: false, msg: "Not found" });
    res.json({ success: true, msg: "Flags updated", news: updatedItem });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

exports.GetAnalytics = async (req, res) => {
  try {
    const stats = await NewsArticle.aggregate([{ $group: { _id: null, totalNews: { $sum: 1 }, authors: { $push: "$author" }, categories: { $push: "$category" } } }]);
    if (!stats.length) return res.status(200).json({ success: true, data: { totalNews: 0, analyticsByAuthor: {}, analyticsByCategory: {} } });

    const analyticsByAuthor = stats[0].authors.reduce((acc, curr) => { acc[curr || 'Unknown'] = (acc[curr || 'Unknown'] || 0) + 1; return acc; }, {});
    const analyticsByCategory = stats[0].categories.reduce((acc, curr) => { acc[curr] = (acc[curr] || 0) + 1; return acc; }, {});

    res.status(200).json({ success: true, data: { totalNews: stats[0].totalNews, analyticsByAuthor, analyticsByCategory } });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error" });
  }
};

/**
 * Employee daily report: how many news each employee published today (or given date), by category.
 */
exports.getEmployeeReport = async (req, res) => {
  try {
    const { date } = req.query;

    // IST offset = UTC + 5:30 = 330 minutes
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    // Parse the date string (e.g. "2026-02-23") as IST midnight
    let targetDateStr;
    if (date) {
      targetDateStr = date; // e.g. "2026-02-23"
    } else {
      // Get today in IST
      const nowIST = new Date(Date.now() + IST_OFFSET_MS);
      targetDateStr = nowIST.toISOString().split('T')[0];
    }

    // Build UTC boundaries for the IST day
    // IST 00:00:00 = UTC targetDate - 5:30
    // IST 23:59:59 = UTC targetDate + 1 day - 5:30 - 1ms
    const startOfDayUTC = new Date(`${targetDateStr}T00:00:00.000+05:30`);
    const endOfDayUTC = new Date(`${targetDateStr}T23:59:59.999+05:30`);

    const results = await NewsArticle.aggregate([
      {
        $match: {
          status: 'published',
          $or: [
            { publishedAt: { $gte: startOfDayUTC, $lte: endOfDayUTC } },
            {
              publishedAt: { $exists: false },
              createdAt: { $gte: startOfDayUTC, $lte: endOfDayUTC }
            },
            {
              publishedAt: null,
              createdAt: { $gte: startOfDayUTC, $lte: endOfDayUTC }
            }
          ]
        }
      },
      {
        $group: {
          _id: {
            authorId: "$authorId",
            author: "$author",
            category: "$category"
          },
          count: { $sum: 1 },
          titles: { $push: "$title" }
        }
      },
      {
        $group: {
          _id: {
            authorId: "$_id.authorId",
            author: "$_id.author"
          },
          totalCount: { $sum: "$count" },
          categories: {
            $push: {
              category: "$_id.category",
              count: "$count",
              titles: "$titles"
            }
          }
        }
      },
      {
        $sort: { totalCount: -1 }
      }
    ]);

    // Format
    const report = results.map(emp => ({
      authorId: emp._id.authorId,
      author: emp._id.author || 'Unknown',
      total: emp.totalCount,
      categories: emp.categories.sort((a, b) => b.count - a.count)
    }));

    res.status(200).json({
      success: true,
      date: targetDateStr,
      report
    });
  } catch (error) {
    console.error("Employee Report Error:", error);
    res.status(500).json({ success: false, msg: "Error fetching employee report" });
  }
};

exports.searchNews = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ success: false, msg: "Search query required" });

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { $text: { $search: q }, status: 'published' };

    const results = await NewsArticle.find(query, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await NewsArticle.countDocuments(query);

    res.status(200).json({
      success: true,
      news: results,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      count: results.length,
      msg: "Search completed"
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

/**
 * Direct Image Branding Endpoint (Used for live preview & instant branding in Admin Panel)
 */
exports.brandUploadedImage = async (req, res) => {
  try {
    const { image, title, category } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, msg: "Image is required" });
    }

    const titleToUse = title && title.trim() ? title.trim() : "Breaking News";
    const brandedBuffer = await imageService.brandImageWithTitle(image, titleToUse, {
      category: category || "india"
    });

    if (!brandedBuffer) {
      return res.status(500).json({ success: false, msg: "Failed to generate branded image" });
    }

    const uploadRes = await uploadToR2(brandedBuffer, {
      folder: "timecyber_news/branded",
      contentType: "image/jpeg",
      extension: "jpg"
    });

    return res.json({
      success: true,
      imageUrl: uploadRes.secure_url
    });
  } catch (error) {
    console.error("Brand Image Error:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

/**
 * Instantly publishes a scheduled or draft article without waiting
 */
exports.publishArticleNow = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await NewsArticle.findOne({ slug });
    if (!article) return res.status(404).json({ success: false, msg: "News not found" });

    article.status = "published";
    article.publishedAt = new Date();
    article.isHidden = false;
    article.scheduledAt = null;
    await article.save();

    triggerFacebookPost(article);

    return res.status(200).json({ success: true, news: article, msg: "Article published immediately!" });
  } catch (error) {
    console.error("Publish Article Now Error:", error);
    res.status(500).json({ success: false, msg: "Error publishing article" });
  }
};


