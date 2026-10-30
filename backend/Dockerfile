# ─── Base image ────────────────────────────────────────────────────────────────
FROM node:20-slim

# ─── System deps for sharp (librsvg) + fonts ───────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Core image libraries used by sharp / librsvg
    libvips-dev \
    librsvg2-bin \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgif-dev \
    libjpeg-dev \
    libpng-dev \
    libwebp-dev \
    # Fontconfig (fixes "Cannot load default config file")
    fontconfig \
    # Latin / general-purpose fonts
    fonts-dejavu-core \
    fonts-liberation \
    fonts-freefont-ttf \
    # Hindi / Devanagari fonts (for your hasHindiCharacters() path)
    fonts-noto \
    fonts-noto-core \
    fonts-noto-extra \
    fonts-indic \
    # Misc utils
    ca-certificates \
    wget \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

# ─── App ───────────────────────────────────────────────────────────────────────
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# Expose port (matches your PORT env var)
EXPOSE 8086

CMD ["npm", "start"]
