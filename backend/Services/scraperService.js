const axios = require("axios");
const cheerio = require("cheerio");
const Parser = require("rss-parser");

const parser = new Parser();

// Resolve Google News redirect URLs to actual article URLs
const resolveGoogleNewsUrl = async (url) => {
    // If it's not a Google News URL, return as-is
    if (!url.includes('news.google.com')) return url;

    try {
        // Google News URLs redirect to actual articles - follow the redirect
        const response = await axios.get(url, {
            maxRedirects: 5,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            validateStatus: () => true, // accept all status codes
            timeout: 10000,
        });

        // After redirect, get the final URL from response
        if (response.request && response.request.res && response.request.res.responseUrl) {
            const finalUrl = response.request.res.responseUrl;
            if (!finalUrl.includes('news.google.com')) {
                console.log(`Resolved Google URL → ${finalUrl}`);
                return finalUrl;
            }
        }

        // Try parsing the HTML for a redirect link
        const $ = cheerio.load(response.data);
        const redirectLink = $('a[href]').filter((i, el) => {
            const href = $(el).attr('href');
            return href && !href.includes('google.com') && href.startsWith('http');
        }).first().attr('href');

        if (redirectLink) {
            console.log(`Parsed redirect URL → ${redirectLink}`);
            return redirectLink;
        }

        // Try og:url meta tag
        const ogUrl = $('meta[property="og:url"]').attr('content');
        if (ogUrl && !ogUrl.includes('google.com')) {
            return ogUrl;
        }

        return url; // fallback to original
    } catch (err) {
        console.warn(`Could not resolve Google URL: ${err.message}`);
        return url;
    }
};

// 1. Scrape Content from a specific Article URL
const scrapeNews = async (originalUrl) => {
    try {
        // Resolve Google News redirect URLs first
        const url = await resolveGoogleNewsUrl(originalUrl);

        const config = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.google.com/',
            },
            timeout: 15000,
            maxRedirects: 5,
        };

        const { data } = await axios.get(url, config);
        const $ = cheerio.load(data);

        // Remove noise elements
        $('script, style, nav, header, footer, aside, .ad, .advertisement, .sidebar, .related, .comments, [class*="social"], [class*="share"], [class*="newsletter"], [id*="comment"]').remove();

        // Try to find the main heading
        const title = $("h1").first().text().trim() || $("title").first().text().trim();

        // Content selectors - from most specific to least specific
        const contentSelectors = [
            'article p',
            '[class*="article-body"] p',
            '[class*="story-body"] p',
            '[class*="article-content"] p',
            '[class*="post-content"] p',
            '[class*="entry-content"] p',
            '.content p',
            'main p',
            '[role="main"] p',
            '.body p',
            'p',
        ];

        let paragraphs = [];
        for (const selector of contentSelectors) {
            const elements = $(selector);
            if (elements.length >= 3) {
                elements.each((i, el) => {
                    const text = $(el).text().trim();
                    if (
                        text.length > 50 &&
                        !text.includes("Subscribe") &&
                        !text.includes("Sign up") &&
                        !text.includes("Cookie") &&
                        !text.includes("Advertisement") &&
                        !text.includes("Read Also") &&
                        !text.includes("Also Read")
                    ) {
                        paragraphs.push(text);
                    }
                });
                if (paragraphs.length >= 3) break;
                paragraphs = []; // reset and try next selector
            }
        }

        const content = paragraphs.slice(0, 15).join(" ");

        // Extract Featured Image
        let image =
            $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('meta[name="thumbnail"]').attr('content') ||
            null;

        if (!image) {
            const firstImg = $('article img, .story-body img, [class*="article"] img, main img').first();
            if (firstImg.length > 0) {
                image = firstImg.attr('src') || firstImg.attr('data-src') || '';
                // Make relative URLs absolute
                if (image && image.startsWith('/')) {
                    try {
                        const base = new URL(url);
                        image = `${base.protocol}//${base.host}${image}`;
                    } catch { }
                }
            }
        }

        if (!title || content.length < 150) {
            throw new Error(`Insufficient content found at ${url} (original: ${originalUrl})`);
        }

        return {
            title,
            facts: content,
            source: url,
            image: image || ''
        };
    } catch (error) {
        console.error(`Scraping Error (${originalUrl}):`, error.message);
        throw error;
    }
};

// 2. Fetch Latest Links from RSS Feed (only last 24 hours)
const getLatestLinks = async (rssUrl) => {
    try {
        const feed = await parser.parseURL(rssUrl);

        const now = new Date();
        const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const recentItems = feed.items.filter(item => {
            if (!item.pubDate) return false;
            const pubDate = new Date(item.pubDate);
            return pubDate >= cutoff;
        });

        console.log(`[${feed.title}] Found ${feed.items.length} items, ${recentItems.length} are within last 24 hours.`);

        return recentItems.slice(0, 10).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source: feed.title
        }));
    } catch (error) {
        console.error(`RSS Error (${rssUrl}):`, error.message);
        return [];
    }
};

module.exports = { scrapeNews, getLatestLinks };
