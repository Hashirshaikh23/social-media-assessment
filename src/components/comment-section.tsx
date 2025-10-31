"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getCommentsService,
  createCommentService,
  deleteCommentService,
  type Comment,
} from "@/services/comment.service";
import { Loader2, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentSection({ postId, isOpen, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch comments when section opens
  useEffect(() => {
    if (isOpen) {
      fetchComments(true);
      // Start polling for updates every 5 seconds
      const interval = setInterval(() => {
        fetchComments(false, true); // Silent refresh
      }, 5000);

      return () => clearInterval(interval);
    } else {
      // Reset state when closed
      setComments([]);
      setPage(1);
      setHasMore(true);
      setText("");
    }
  }, [isOpen, postId]);

  const fetchComments = async (showLoading = true, silent = false) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const response = await getCommentsService(postId, 1, 20);
      if (response) {
        setComments(response.comments);
        setHasMore(response.pagination.hasMore);
        setPage(1);
      }
    } catch (error) {
      if (!silent) {
        toast.error("Failed to load comments");
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const response = await getCommentsService(postId, page + 1, 20);
      if (response) {
        setComments((prev) => [...prev, ...response.comments]);
        setHasMore(response.pagination.hasMore);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to load more comments");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || text.trim().length === 0) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (text.length > 500) {
      toast.error("Comment cannot exceed 500 characters");
      return;
    }

    setSubmitting(true);

    // Optimistic update
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      postId,
      userId: "",
      username: "You",
      text: text.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOwn: true,
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setText("");

    try {
      const result = await createCommentService({
        postId,
        text: text.trim(),
      });

      if (result.success && result.data) {
        // Replace optimistic comment with real one
        setComments((prev) =>
          prev.map((c) =>
            c.id === optimisticComment.id ? result.data! : c
          )
        );
        toast.success("Comment added successfully");
      } else {
        // Revert optimistic update
        setComments((prev) =>
          prev.filter((c) => c.id !== optimisticComment.id)
        );
        setText(text.trim()); // Restore text
        toast.error(result.message || "Failed to add comment");
      }
    } catch (error) {
      // Revert optimistic update
      setComments((prev) =>
        prev.filter((c) => c.id !== optimisticComment.id)
      );
      setText(text.trim()); // Restore text
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    // Optimistic update
    const originalComments = [...comments];
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    try {
      const result = await deleteCommentService(commentId);
      if (result.success) {
        toast.success("Comment deleted successfully");
        // Refresh comments to get accurate count
        fetchComments(false);
      } else {
        // Revert optimistic update
        setComments(originalComments);
        toast.error(result.message || "Failed to delete comment");
      }
    } catch (error) {
      // Revert optimistic update
      setComments(originalComments);
      toast.error("Failed to delete comment");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="border-t pt-4 mt-4 space-y-4">
      {/* Comments List */}
      <ScrollArea className="h-[300px] pr-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 items-start group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      @{comment.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                    {comment.text}
                  </p>
                </div>
                {comment.isOwn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Load More Button */}
      {!loading && hasMore && comments.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Comments"
            )}
          </Button>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitting}
          maxLength={500}
          className="min-h-[80px] resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length}/500 characters
          </span>
          <Button type="submit" disabled={submitting || !text.trim()}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

