const axios = require("axios");

/**
 * Posts a message and link to a Facebook Page.
 * @param {string} pageId - The ID of the Facebook Page.
 * @param {string} pageAccessToken - The Page Access Token.
 * @param {string} message - The message text (e.g., article title).
 * @param {string} link - The URL to share.
 * @param {string} picture - (Optional) Absolute URL for the post thumbnail.
 */
exports.postToPage = async (pageId, pageAccessToken, message, link, picture = null) => {
    try {
        if (!pageId || !pageAccessToken) {
            console.warn("Facebook auto-post skipped: Missing credentials for page", pageId);
            return { success: false, msg: "Missing credentials" };
        }

        // 1. If an image is provided, post to /{pageId}/photos endpoint.
        // This creates a photo post with caption & link, avoiding the Meta restriction:
        // "(#100) Only owners of the URL have the ability to specify the picture param"
        if (picture && typeof picture === "string" && (picture.startsWith("http://") || picture.startsWith("https://"))) {
            try {
                const photoResponse = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
                    url: picture,
                    caption: `${message}\n${link}`,
                    published: true,
                    access_token: pageAccessToken
                });

                const postId = photoResponse.data.post_id || photoResponse.data.id;
                console.log(`Successfully posted photo to Facebook Page ${pageId}:`, postId);
                return { success: true, postId };
            } catch (photoErr) {
                console.warn("[Facebook] Photo endpoint failed, attempting fallback to feed:", photoErr.response?.data?.error?.message || photoErr.message);
            }
        }

        // 2. Feed Post: DO NOT include 'picture' parameter here.
        // Facebook Graph API v19 rejects 'picture' on /feed unless domain ownership is verified.
        const postData = {
            message,
            link,
            published: true,
            access_token: pageAccessToken
        };

        const response = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/feed`, postData);

        console.log(`Successfully posted to Facebook Page ${pageId}:`, response.data.id);
        return { success: true, postId: response.data.id };

    } catch (error) {
        console.error("Facebook Post Error:", error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message
        };
    }
};
