import { serverFetch } from "../core/fetch";


export const getForumPosts = async (authorId = null, queryString = "") => {
  const uri = authorId? `/api/forum?authorId=${authorId}&${queryString}`: `/api/forum?${queryString}`
  return serverFetch(uri);
};



export const getForumById = async (id) => {
    return serverFetch(`/api/forum/${id}`);
}