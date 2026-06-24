'use server'

import { serverMutation } from "../core/Server";



export const createForum = async (forumData) => {
    return serverMutation('/api/forum', forumData);
}


export const deleteForumPost = async (id) => {
  return serverMutation(`/api/forum/${id}`, {}, 'DELETE');
}