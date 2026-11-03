-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "previewGradient" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "instrument" TEXT,
    "pages" INTEGER,
    "tuning" TEXT,
    "hasGtp" BOOLEAN,
    "instruments" TEXT[],
    "partsCount" INTEGER,
    "videoDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT 'course',
    "title" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "previewGradient" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "lessons" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "hasCertificate" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL DEFAULT 'me',
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "isTeacher" BOOLEAN NOT NULL DEFAULT false,
    "avatarGradient" TEXT NOT NULL,
    "coverGradient" TEXT NOT NULL,
    "instruments" TEXT[],
    "bio" TEXT NOT NULL,
    "youtube" TEXT,
    "telegram" TEXT,
    "website" TEXT,
    "points" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "rankLabel" TEXT NOT NULL,
    "publications" INTEGER NOT NULL,
    "earnings" INTEGER NOT NULL,
    "progressCurrent" INTEGER NOT NULL,
    "progressTarget" INTEGER NOT NULL,
    "progressLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopAuthor" (
    "id" TEXT NOT NULL,
    "place" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "delta" INTEGER NOT NULL,
    "rankLabel" TEXT NOT NULL,
    "isMe" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TopAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TopAuthor_place_key" ON "TopAuthor"("place");
