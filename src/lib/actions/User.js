import { serverMutation } from "../core/Server";

export const updateUser = async (userId, action) => {
  return serverMutation(
    `/api/admin/users/${userId}`,
    { action },
    "PATCH"
  );
};