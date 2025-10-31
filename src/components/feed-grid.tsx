"use client";

import { useState } from "react";
import { PostCard } from "@/components/post-card";

interface FeedGridProps {
  posts: Array<{ id: string; title: string; author: string; description: string }>;
}

export function FeedGrid({ posts }: FeedGridProps) {
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const handleToggleComments = (postId: string) => {
    setOpenPostId((prev) => (prev === postId ? null : postId));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isCommentsOpen={openPostId === post.id}
          onToggleComments={handleToggleComments}
        />
      ))}
    </div>
  );
}
