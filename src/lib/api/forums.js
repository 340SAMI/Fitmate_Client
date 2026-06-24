import { serverFetch } from "../core/Server";

export const getForumPosts = async (authorId = null) => {
  const url = authorId
    ? `/api/forum?authorId=${authorId}`
    : `/api/forum`;
  return serverFetch(url);
}