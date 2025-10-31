import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

/**
 * DELETE /api/comment/[commentId]
 * Deletes a comment (only if user owns it)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const { commentId } = await params;

    if (!commentId || !ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { message: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Find the comment
    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (String(comment.userId) !== user.userId) {
      return NextResponse.json(
        { message: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Delete the comment
    await db
      .collection("comments")
      .deleteOne({ _id: new ObjectId(commentId) });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

