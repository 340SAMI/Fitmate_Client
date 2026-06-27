import { serverFetch } from "../core/Server"

export const getUsers = async ()=>{
    return serverFetch(`/api/admin/users`);
}