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

        const postData = {
            message,
            link,
            published: true,
            access_token: pageAccessToken
        };

        if (picture) {
            postData.picture = picture;
        }

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
