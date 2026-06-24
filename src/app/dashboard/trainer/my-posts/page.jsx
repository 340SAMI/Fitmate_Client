import { getUserSession } from "@/lib/core/Session";
import MyForumPosts from "./MyForumPosts";
import { getForumPosts } from "@/lib/api/forums";

export default async function MyForumPostsPage() {
  const user = await getUserSession();

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum?authorId=${}`,
  //   { cache: "no-store" }
  // );
  const { posts } = await getForumPosts(user?.id)

  return <MyForumPosts initialPosts={posts ?? []} />;
}
