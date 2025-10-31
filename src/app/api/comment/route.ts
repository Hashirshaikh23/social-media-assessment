import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

// Validation schemas
const createCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  text: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot exceed 500 characters")
    .trim(),
});

const getCommentsSchema = z.object({
  postId: z.string().min(1),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
});

/**
 * GET /api/comment
 * Fetches comments for a specific post with pagination
 * Query params: postId, page, limit
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const { searchParams } = new URL(req.url);
    const params = {
      postId: searchParams.get("postId") || "",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    };

    const validated = getCommentsSchema.parse(params);
    const page = parseInt(validated.page, 10);
    const limit = parseInt(validated.limit, 10);
    const skip = (page - 1) * limit;

    const db = await getDb();

    // Fetch comments with pagination, sorted by newest first
    const comments = await db
      .collection("comments")
      .find({ postId: validated.postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination info
    const totalCount = await db
      .collection("comments")
      .countDocuments({ postId: validated.postId });

    // Format comments for response
    const formattedComments = comments.map((comment) => ({
      id: String(comment._id),
      postId: comment.postId,
      userId: String(comment.userId),
      username: comment.username,
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      isOwn: String(comment.userId) === user.userId,
    }));

    return NextResponse.json({
      comments: formattedComments,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount,
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json(
        { message: "Invalid request parameters" },
        { status: 400 }
      );
    }
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comment
 * Creates a new comment for a post
 * Body: { postId: string, text: string }
 */
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const body = await req.json();
    const validated = createCommentSchema.parse(body);

    const db = await getDb();

    // Verify post exists (from static posts)
    const { samplePosts } = await import("@/data/posts");
    const postExists = samplePosts.some((p) => p.id === validated.postId);
    
    if (!postExists) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // Get user's username for denormalization
    const userDoc = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user.userId) });

    if (!userDoc || !userDoc.username) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const commentData = {
      postId: validated.postId,
      userId: new ObjectId(user.userId),
      username: userDoc.username,
      text: validated.text,
      createdAt: now,
      updatedAt: now,
    };

    // Insert comment
    const result = await db.collection("comments").insertOne(commentData);

    const createdComment = {
      id: String(result.insertedId),
      postId: commentData.postId,
      userId: user.userId,
      username: commentData.username,
      text: commentData.text,
      createdAt: commentData.createdAt,
      updatedAt: commentData.updatedAt,
      isOwn: true,
    };

    return NextResponse.json(createdComment, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json(
        { message: "Invalid request payload" },
        { status: 400 }
      );
    }
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

