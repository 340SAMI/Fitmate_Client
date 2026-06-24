import ForumListingContainer from "@/component/Forum/ForumListingContainer";
import { getForumPosts } from "@/lib/api/forums";

export default async function ForumPage() {
  const response = await getForumPosts();
  const posts = response?.posts ?? [];

  return <ForumListingContainer initialPosts={posts} />;
}
