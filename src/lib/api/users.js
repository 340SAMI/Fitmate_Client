import { serverFetch } from "../core/Server"

export const getUsers = async (query)=>{
    return serverFetch(`/api/admin/users${query}`);
}

