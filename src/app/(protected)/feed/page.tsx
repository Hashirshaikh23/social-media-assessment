import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { samplePosts as posts } from "@/data/posts";

export default async function HomeFeedPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">{post.title}</CardTitle>
            <CardDescription>by @{post.author}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="p-4 text-sm text-muted-foreground">
              {post.description}
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              0 likes • 0 comments
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm rounded-md border">
                Like
              </button>
              <button className="px-3 py-1 text-sm rounded-md border">
                Comment
              </button>
              <button className="px-3 py-1 text-sm rounded-md border">
                Bookmark
              </button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
