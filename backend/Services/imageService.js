const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const hasHindiCharacters = (text) => {
    if (!text) return false;
    return /[\u0900-\u097F]/.test(text);
};

const getLogoPath = () => {
    const candidates = [
        path.join(__dirname, '..', 'Assets', 'logo1.jpeg'),
        path.join(__dirname, '..', 'Assets', 'logo.png'),
        path.join(__dirname, '..', '..', 'frontend', 'public', 'logo.png')
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return null;
};

/**
 * Helper to resolve a Buffer from a URL, Base64 string, or Buffer.
 */
const getImageBuffer = async (input) => {
    if (Buffer.isBuffer(input)) return input;
    if (typeof input !== 'string') throw new Error("Invalid image input type");

    if (input.startsWith('http')) {
        let domain = "https://www.google.com/";
        try {
            const urlObj = new URL(input);
            domain = `${urlObj.protocol}//${urlObj.hostname}/`;
        } catch (e) { }

        const config = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                'Referer': domain,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site'
            },
            responseType: 'arraybuffer',
            timeout: 15000
        };
        const response = await axios.get(input, config);
        return Buffer.from(response.data);
    }

    if (input.startsWith('data:image')) {
        const base64Data = input.split(',')[1] || input;
        return Buffer.from(base64Data, 'base64');
    }

    // Assume raw base64 if no prefix but looks like it
    return Buffer.from(input, 'base64');
};

const applyWatermark = async (imageUrl, source = "") => {
    try {
        const src = (source || "").toLowerCase();
        console.log(`[Anti-Copyright] Transforming image for ${src}`);

        const brandedKeywords = ["timecyber_news/branded", "branded_"];
        if (typeof imageUrl === "string" && brandedKeywords.some(kw => imageUrl.toLowerCase().includes(kw))) {
            console.log(`[Anti-Copyright-Skip] Image already processed (URL: ${imageUrl}).`);
            return await getImageBuffer(imageUrl);
        }

        const inputBuffer = await getImageBuffer(imageUrl);
        const logoPath = getLogoPath();

        const imageMetadata = await sharp(inputBuffer).metadata();
        const { width, height } = imageMetadata;

        const background = await sharp(inputBuffer)
            .resize(width, height)
            .blur(20)
            .modulate({ brightness: 0.7 })
            .toBuffer();

        const foreground = await sharp(inputBuffer)
            .resize({ width: Math.round(width * 0.95), height: Math.round(height * 0.90), fit: 'contain' })
            .toBuffer();

        const headerStrip = await sharp({
            create: {
                width: width,
                height: Math.round(height * 0.05),
                channels: 4,
                background: { r: 180, g: 0, b: 0, alpha: 0.8 }
            }
        }).png().toBuffer();

        const compositeList = [
            { input: foreground, gravity: 'center' },
            { input: headerStrip, gravity: 'north' }
        ];

        if (logoPath) {
            const logoSize = Math.min(Math.round(width * 0.15), 180);
            const resizedLogo = await sharp(logoPath)
                .resize({ width: logoSize, height: logoSize, fit: 'contain' })
                .toBuffer();
            compositeList.push({ input: resizedLogo, top: 15, left: 20 });
        }

        const transformedBuffer = await sharp(background)
            .composite(compositeList)
            .modulate({ saturation: 1.1 })
            .jpeg({ quality: 90 })
            .toBuffer();

        return transformedBuffer;
    } catch (err) {
        console.error(`[Anti-Copyright] ❌ Error: ${err.message}`);
        return null;
    }
};

const addLogoToImage = async (imageBuffer) => {
    try {
        const logoPath = getLogoPath();
        const metadata = await sharp(imageBuffer).metadata();
        const { width, height } = metadata;

        const gradedImage = await sharp(imageBuffer)
            .modulate({ brightness: 1.05, saturation: 1.3, lightness: 0 })
            .linear(1.1, -15)
            .toBuffer();

        const background = await sharp(gradedImage)
            .resize(width, height)
            .blur(30)
            .modulate({ brightness: 0.55 })
            .toBuffer();

        const fgW = Math.round(width * 0.94);
        const fgH = Math.round(height * 0.88);

        const foreground = await sharp(gradedImage)
            .resize({ width: fgW, height: fgH, fit: 'contain' })
            .extend({
                top: 2, bottom: 2, left: 2, right: 2,
                background: { r: 255, g: 255, b: 255, alpha: 0.3 }
            })
            .toBuffer();

        const stripH = Math.round(height * 0.065);
        const redGradient = Buffer.from(`
            <svg width="${width}" height="${stripH}">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#b9000a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ff2e3a;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="${width}" height="${stripH}" fill="url(#grad1)" />
                <text x="${width - 20}" y="${stripH / 2 + 6}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="end">TIME CYBER MEDIA</text>
            </svg>
        `);

        const compositeElements = [
            { input: foreground, gravity: 'center' },
            { input: redGradient, gravity: 'north' }
        ];

        if (logoPath) {
            const logoSize = Math.min(Math.round(width * 0.20), 320);
            const glow = Buffer.from(`
                <svg width="${logoSize + 40}" height="${logoSize + 40}">
                    <defs>
                        <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="15" />
                            <feOffset dx="0" dy="0" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.6" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic6" />
                            </feMerge>
                        </filter>
                    </defs>
                    <circle cx="${(logoSize + 40) / 2}" cy="${(logoSize + 40) / 2}" r="${logoSize / 2}" fill="black" filter="url(#f1)" opacity="0.3" />
                </svg>
            `);

            const resizedLogo = await sharp(logoPath)
                .resize({ width: logoSize, height: logoSize, fit: 'contain' })
                .toBuffer();

            compositeElements.push(
                { input: glow, top: 0, left: 10 },
                { input: resizedLogo, top: 20, left: 30 }
            );
        }

        const outputBuffer = await sharp(background)
            .composite(compositeElements)
            .jpeg({ quality: 90 })
            .toBuffer();

        return outputBuffer;
    } catch (err) {
        console.error(`[HD-Master-Edit] ❌ Error: ${err.message}`);
        throw err;
    }
};

/**
 * Full Newsroom Branding with Title Overlay
 * Used for social media posts (Facebook, etc.) and published news articles
 */
const brandImageWithTitle = async (imageUrl, title, options = { addLogo: true, category: null }) => {
    try {
        const addLogo = options?.addLogo !== false;
        const category = options?.category;
        const domainText = options?.domainText || "timecybermedia.com";
        const headerBadgeText = options?.headerBadgeText || "TIME CYBER MEDIA";

        // SKIP BRANDING for specific categories (Awards, Events, etc.)
        const categoriesToSkip = ["awards", "events", "event"];
        const normalizedCats = Array.isArray(category)
            ? category.map(c => String(c).toLowerCase())
            : [String(category).toLowerCase()];

        const isExcluded = normalizedCats.some(c => categoriesToSkip.includes(c));
        const titleLower = (title || "").toLowerCase();
        const titleExcludes = categoriesToSkip.some(kw => titleLower.includes(kw));

        // Skip branding if already branded to prevent double-branding
        const brandedKeywords = ["timecyber_news/branded", "branded_"];
        const alreadyBranded = typeof imageUrl === "string" && brandedKeywords.some(kw => imageUrl.toLowerCase().includes(kw));

        if (isExcluded || titleExcludes || alreadyBranded) {
            console.log(`[Branding-Skip] ${alreadyBranded ? 'Already branded' : 'Exclusion rule'} triggered (URL: ${imageUrl}). Returning original image.`);
            return await getImageBuffer(imageUrl);
        }

        console.log(`[Branding-Final] Mastering professional white-card for: ${title}`);

        const imageBuffer = await getImageBuffer(imageUrl);
        const logoPath = getLogoPath();

        const width = 1200;
        const height = 675;

        const gradedImage = await sharp(imageBuffer)
            .resize(width, height, { fit: 'cover', position: 'center' })
            .modulate({ brightness: 1.05, saturation: 1.25 })
            .linear(1.05, -5)
            .toBuffer();

        const escapeXML = (str) => str.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[m]);

        const safeTitle = escapeXML((title || "").trim());
        const isHindi = hasHindiCharacters(title);
        const words = safeTitle.split(' ');

        let splitIdx = isHindi ? 4 : 3;
        if (words.length <= splitIdx) splitIdx = Math.max(1, words.length - 1);

        const firstPartText = words.slice(0, splitIdx).join(' ');
        const restText = words.slice(splitIdx).join(' ');

        let fontSize = 42;
        if (title.length > 60) fontSize = 38;
        if (title.length > 100) fontSize = 34;
        if (title.length > 150) fontSize = 30;

        const lineSpacing = fontSize * 1.35;
        const charWidth = isHindi ? (fontSize * 0.72) : (fontSize * 0.58);
        const maxChars = Math.floor((width * 0.92) / charWidth);

        const wrapLines = (text, limit) => {
            const lines = [];
            let current = "";
            text.split(' ').forEach(w => {
                if ((current + w).length > limit) {
                    lines.push(current.trim());
                    current = w + " ";
                } else {
                    current += w + " ";
                }
            });
            if (current) lines.push(current.trim());
            return lines;
        };

        const firstLines = wrapLines(firstPartText, maxChars);
        const restLines = wrapLines(restText, maxChars);
        const totalLines = firstLines.length + restLines.length;

        const titleStartY = 110;
        const titleEndY = titleStartY + (totalLines * lineSpacing);
        const urlPillY = titleEndY + 30;
        const cardH = urlPillY + 90;
        const totalH = Math.round(height + cardH);

        const bgBlur = await sharp(imageBuffer)
            .resize(width, totalH, { fit: 'cover' })
            .blur(40)
            .modulate({ brightness: 0.6, saturation: 1.2 })
            .toBuffer();

        const frameW = Math.round(width * 0.94);
        const frameH = Math.round(height * 0.92);
        const mainImageFrame = await sharp(gradedImage)
            .resize({ width: frameW, height: frameH, fit: 'cover' })
            .extend({
                top: 4, bottom: 4, left: 4, right: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0.2 }
            })
            .toBuffer();

        const glassOverlay = Buffer.from(`
            <svg width="${width}" height="${cardH}">
                <defs>
                    <linearGradient id="crimson" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4a0000;stop-opacity:0.95" />
                        <stop offset="100%" style="stop-color:#1a0000;stop-opacity:0.90" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                        <feOffset dx="0" dy="3" />
                        <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
                        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
                
                <rect width="${width}" height="${cardH}" fill="url(#crimson)" />
                <rect width="${width}" height="2" fill="rgba(255,255,255,0.1)" />

                <!-- Header Ticker Badge -->
                <rect x="${width / 2 - 150}" y="20" width="300" height="42" rx="21" fill="#CC0000" filter="url(#shadow)" />
                <text x="${width / 2}" y="48" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="20px" fill="white" letter-spacing="1.5px">${headerBadgeText}</text>

                <!-- Headline (Luxury White & Gold) -->
                <g filter="url(#shadow)">
                    ${firstLines.map((line, i) => {
            const y = titleStartY + (i * lineSpacing);
            return `<text x="${width / 2}" y="${y}" text-anchor="middle" font-family="Nirmala UI, Arial, sans-serif" font-size="${fontSize + 2}" font-weight="900" fill="#FFFFFF">${line}</text>`;
        }).join('')}
                    ${restLines.map((line, i) => {
            const y = titleStartY + ((i + firstLines.length) * lineSpacing);
            return `<text x="${width / 2}" y="${y}" text-anchor="middle" font-family="Nirmala UI, Arial, sans-serif" font-size="${fontSize}" font-weight="900" fill="#FFD700">${line}</text>`;
        }).join('')}
                </g>

                <!-- URL Sticker (Gold-to-Orange Pill) -->
                <rect x="${width / 2 - 160}" y="${urlPillY}" width="320" height="46" rx="23" fill="#FFD700" filter="url(#shadow)" />
                <text x="${width / 2}" y="${urlPillY + 31}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="20px" fill="#4d0000" letter-spacing="0.05em">${domainText}</text>
            </svg>
        `);

        const compositeElements = [
            { input: mainImageFrame, top: 40, left: Math.round((width - frameW - 8) / 2) },
            { input: glassOverlay, top: height, left: 0 }
        ];

        if (addLogo && logoPath) {
            const logoSize = Math.min(Math.round(width * 0.18), 300);
            const badgeSize = logoSize + 60;

            const logoBadge = Buffer.from(`
                <svg width="${badgeSize}" height="${badgeSize}">
                    <defs>
                        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                            <feOffset dx="0" dy="4" />
                            <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
                            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <linearGradient id="silver" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.4" />
                            <stop offset="100%" style="stop-color:#AAAAAA;stop-opacity:0.2" />
                        </linearGradient>
                    </defs>
                    <circle cx="${badgeSize / 2}" cy="${badgeSize / 2}" r="${badgeSize / 2 - 10}" fill="rgba(255,255,255,0.2)" filter="url(#badgeShadow)" />
                    <circle cx="${badgeSize / 2}" cy="${badgeSize / 2}" r="${badgeSize / 2 - 10}" fill="none" stroke="url(#silver)" stroke-width="2" />
                    <circle cx="${badgeSize / 2}" cy="${badgeSize / 2}" r="${badgeSize / 2 - 15}" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.3" />
                </svg>
            `);

            const resizedLogo = await sharp(logoPath)
                .resize({ width: logoSize, height: logoSize, fit: 'contain' })
                .toBuffer();

            compositeElements.push(
                { input: logoBadge, top: 20, left: 20 },
                { input: resizedLogo, top: 50, left: 50 }
            );
        }

        const finalBuffer = await sharp(bgBlur)
            .composite(compositeElements)
            .jpeg({ quality: 90 })
            .toBuffer();

        return finalBuffer;
    } catch (err) {
        console.error(`[Branding-Final] ❌ Error: ${err.message}`);
        return null;
    }
};

module.exports = { applyWatermark, addLogoToImage, brandImageWithTitle };
