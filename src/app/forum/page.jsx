import ForumListingContainer from "@/component/Forum/ForumListingContainer";
import { getForumPosts } from "@/lib/api/forums";

export const metadata = {
  title: 'Forum Page',  // renders as → "About | My App"
}


export default async function ForumPage() {
  const response = await getForumPosts();
  const posts = response?.posts ?? [];

  return <ForumListingContainer initialPosts={posts} />;
}
