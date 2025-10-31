import { samplePosts as posts } from "@/data/posts";
import { FeedGrid } from "@/components/feed-grid";

export default async function HomeFeedPage() {
  return (
    <FeedGrid posts={posts} />
  );
}
