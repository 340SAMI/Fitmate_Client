import { serverFetch } from "../core/Server"

export const getUsers = async (query='')=>{
    console.log(`/api/admin/users${query}`);
    return serverFetch(`/api/admin/users${query}`);
}

