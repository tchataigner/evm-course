-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('GRANT_ROLE', 'REVOKE_ROLE');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventType" "EventType" NOT NULL,
    "data" JSONB NOT NULL,
    "blockHeight" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isMinter" BOOLEAN NOT NULL DEFAULT false,
    "isRedeemer" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utils" (
    "id" SERIAL NOT NULL,
    "ethereumBlockHeight" TEXT NOT NULL,

    CONSTRAINT "Utils_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_blockHeight_transactionHash_logIndex_key" ON "Event"("blockHeight", "transactionHash", "logIndex");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");
