const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a base64 image or a URL to Cloudflare R2
 * @param {string} fileData - Base64 string or URL
 * @param {object} options - Options { folder: string }
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
exports.uploadToR2 = async (fileData, options = {}) => {
  try {
    let buffer, contentType, extension = "png";

    if (fileData.startsWith("data:image")) {
      // Parse base64
      const matches = fileData.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 image data");
      }
      extension = matches[1];
      contentType = `image/${extension}`;
      buffer = Buffer.from(matches[2], "base64");
    } else if (fileData.startsWith("http")) {
      // Fetch image from URL
      let fetchFn = global.fetch;
      if (!fetchFn) {
        fetchFn = require("axios").get; // Simple fallback if fetch is not globally available in this node version
        const response = await fetchFn(fileData, { responseType: 'arraybuffer' });
        buffer = Buffer.from(response.data);
        contentType = response.headers['content-type'] || 'image/jpeg';
        extension = contentType.split('/')[1] || 'jpg';
      } else {
        const response = await fetchFn(fileData);
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
        contentType = response.headers.get('content-type') || 'image/jpeg';
        extension = contentType.split('/')[1] || 'jpg';
      }
    } else {
      throw new Error("Unsupported file data format. Only base64 and URLs are supported.");
    }

    const folder = options.folder ? `${options.folder}/` : "";
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const key = `${folder}${Date.now()}-${uniqueId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";
    // Ensure URL doesn't end with a slash
    const baseUrl = publicUrl.endsWith("/") ? publicUrl.slice(0, -1) : publicUrl;

    return {
      secure_url: `${baseUrl}/${key}`,
      public_id: key,
    };
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw error;
  }
};

/**
 * Deletes an object from Cloudflare R2
 * @param {string} key - The object key (public_id)
 */
exports.deleteFromR2 = async (key) => {
  try {
    if (!key) return;
    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("R2 Delete Error:", error);
    throw error;
  }
};
