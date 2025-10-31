"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/comment-section";
import { getCommentsService } from "@/services/comment.service";

interface IPostCard {
  post: {
    id: string;
    title: string;
    author: string;
    description: string;
  };
  isCommentsOpen?: boolean; // controlled open state
  onToggleComments?: (postId: string) => void; // controlled toggle handler
}

export const PostCard = ({ post, isCommentsOpen, onToggleComments }: IPostCard) => {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, number>>({});
  const [commentCount, setCommentCount] = useState<number>(0);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isOpen = typeof isCommentsOpen === "boolean" ? isCommentsOpen : uncontrolledOpen;

  // Fetch initial comment count
  useEffect(() => {
    fetchCommentCount();
    
    // Poll for comment count updates every 5 seconds
    const interval = setInterval(() => {
      fetchCommentCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [post.id]);

  const fetchCommentCount = async () => {
    try {
      const response = await getCommentsService(post.id, 1, 1); // Just need pagination info
      if (response) {
        setCommentCount(response.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch comment count:", error);
    }
  };

  const toggleCommentSection = () => {
    if (onToggleComments) {
      onToggleComments(post.id);
    } else {
      setUncontrolledOpen((prev) => !prev);
    }
    // Refresh comment count when opening
    if (!isOpen) {
      fetchCommentCount();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-4">
        <CardTitle className="text-base">{post.title}</CardTitle>
        <CardDescription>by @{post.author}</CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-base text-muted-foreground">{post.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start py-4">
        <div className="text-sm text-muted-foreground w-full">
          {likes[post.id] || 0} likes • {commentCount}{" "}
          comments • {bookmarks[post.id] || 0} bookmarks
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1">
            Like
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 relative"
            onClick={toggleCommentSection}
          >
            Comment
            {commentCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs"
              >
                {commentCount > 99 ? "99+" : commentCount}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Bookmark
          </Button>
        </div>
        {/* Comment Section */}
        <div className="w-full">
          <CommentSection
            postId={post.id}
            isOpen={isOpen}
            onClose={() => (onToggleComments ? onToggleComments(post.id) : setUncontrolledOpen(false))}
          />
        </div>
      </CardFooter>
    </Card>
  );
};
