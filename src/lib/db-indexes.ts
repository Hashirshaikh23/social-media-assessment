/**
 * Database Index Setup
 * 
 * This file documents the required indexes for optimal comment performance.
 * Run these indexes in MongoDB shell or MongoDB Compass:
 * 
 * For comments collection:
 * 1. db.comments.createIndex({ postId: 1, createdAt: -1 })
 * 2. db.comments.createIndex({ userId: 1 })
 * 3. db.comments.createIndex({ createdAt: -1 })
 * 
 * These indexes will significantly improve query performance for:
 * - Fetching comments by post (sorted by date)
 * - Finding comments by user (for ownership checks)
 * - General sorting by creation date
 */

import { getDb } from "./db";

/**
 * Creates recommended indexes for comments collection
 * Run this function once during application startup or as a one-time script
 */
export async function createCommentIndexes() {
  try {
    const db = await getDb();
    const commentsCollection = db.collection("comments");

    // Compound index for fetching comments by post, sorted by date (newest first)
    await commentsCollection.createIndex(
      { postId: 1, createdAt: -1 },
      { name: "postId_createdAt_index" }
    );

    // Index for finding comments by user (for ownership checks)
    await commentsCollection.createIndex(
      { userId: 1 },
      { name: "userId_index" }
    );

    // Index for sorting by creation date
    await commentsCollection.createIndex(
      { createdAt: -1 },
      { name: "createdAt_index" }
    );

    console.log("Comment indexes created successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
    throw error;
  }
}

