"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IPostCard {
  post: {
    id: string;
    title: string;
    author: string;
    description: string;
  };
}

export const PostCard = ({ post }: IPostCard) => {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, number>>({});

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-4">
        <CardTitle className="text-base">{post.title}</CardTitle>
        <CardDescription>by @{post.author}</CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-base text-muted-foreground">{post.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {likes[post.id] || 0} likes • {comments[post.id]?.length || 0}{" "}
          comments • {bookmarks[post.id] || 0} bookmarks
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm rounded-md border">Like</button>
          <button className="px-3 py-1 text-sm rounded-md border">
            Comment
          </button>
          <button className="px-3 py-1 text-sm rounded-md border">
            Bookmark
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
