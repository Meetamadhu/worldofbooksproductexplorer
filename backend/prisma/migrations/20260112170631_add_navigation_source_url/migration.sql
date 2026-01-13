-- CreateTable
CREATE TABLE "Navigation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "lastScrapedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Navigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "navigationId" TEXT NOT NULL,
    "parentId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "imageUrl" TEXT,
    "lastScrapedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "price" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "imageUrl" TEXT,
    "description" TEXT,
    "lastScrapedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDetail" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "description" TEXT,
    "publisher" TEXT,
    "publicationDate" TIMESTAMP(3),
    "isbn" TEXT,
    "pages" INTEGER,
    "language" TEXT,
    "specs" JSONB,
    "ratingsAvg" DOUBLE PRECISION DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapeJob" (
    "id" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "errorLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapeJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewHistory" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pathJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ViewHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Navigation_title_key" ON "Navigation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Navigation_slug_key" ON "Navigation"("slug");

-- CreateIndex
CREATE INDEX "Navigation_slug_idx" ON "Navigation"("slug");

-- CreateIndex
CREATE INDEX "Navigation_lastScrapedAt_idx" ON "Navigation"("lastScrapedAt");

-- CreateIndex
CREATE INDEX "Category_navigationId_idx" ON "Category"("navigationId");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_lastScrapedAt_idx" ON "Category"("lastScrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_navigationId_slug_key" ON "Category"("navigationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sourceId_key" ON "Product"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sourceUrl_key" ON "Product"("sourceUrl");

-- CreateIndex
CREATE INDEX "Product_sourceId_idx" ON "Product"("sourceId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_lastScrapedAt_idx" ON "Product"("lastScrapedAt");

-- CreateIndex
CREATE INDEX "Product_sourceUrl_idx" ON "Product"("sourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetail_productId_key" ON "ProductDetail"("productId");

-- CreateIndex
CREATE INDEX "ProductDetail_productId_idx" ON "ProductDetail"("productId");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE INDEX "ScrapeJob_status_idx" ON "ScrapeJob"("status");

-- CreateIndex
CREATE INDEX "ScrapeJob_targetType_idx" ON "ScrapeJob"("targetType");

-- CreateIndex
CREATE INDEX "ScrapeJob_createdAt_idx" ON "ScrapeJob"("createdAt");

-- CreateIndex
CREATE INDEX "ViewHistory_sessionId_idx" ON "ViewHistory"("sessionId");

-- CreateIndex
CREATE INDEX "ViewHistory_createdAt_idx" ON "ViewHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_navigationId_fkey" FOREIGN KEY ("navigationId") REFERENCES "Navigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDetail" ADD CONSTRAINT "ProductDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
