# ─── Base ──────────────────────────────────────────────────────────────────────
FROM node:20-slim

# ─── Only what's needed for font rendering in sharp/SVG ────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    fontconfig \
    fonts-dejavu-core \
    fonts-liberation \
    fonts-noto \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

# ─── App ───────────────────────────────────────────────────────────────────────
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 8086
CMD ["npm", "start"]
