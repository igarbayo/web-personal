# ── Stage 1: Build CMS Frontend Static Files ─────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /repo
COPY src/frontend/ src/frontend/

WORKDIR /repo/src/frontend
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Setup CMS route and build the static export
ENV NEXT_PUBLIC_CMS_ROUTE=admin
RUN node scripts/setup-cms-route.mjs \
    && node scripts/gen-llms-txt.mjs \
    && npx next build

# Copy the CMS page from the static export to a clean output folder
RUN mkdir -p /cms-static \
    && cp -r out/* /cms-static/ \
    && if [ -f /cms-static/admin/index.html ]; then cp /cms-static/admin/index.html /cms-static/index.html; fi


# ── Stage 2: Python Backend + Embedded CMS UI ────────────────────────
FROM python:3.12-slim

WORKDIR /app

# System deps for Pillow (WebP/JPEG)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libjpeg-dev \
    zlib1g-dev \
    libwebp-dev \
    && rm -rf /var/lib/apt/lists/*

COPY src/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/backend/ .

# Embed the CMS static build so FastAPI serves it on /
COPY --from=frontend-builder /cms-static/ /app/static/

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
