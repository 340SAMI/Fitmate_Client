import { serverFetch } from "../core/fetch";


export const getUsers = async (query='')=>{
    console.log(`/api/admin/users${query}`);
    return serverFetch(`/api/admin/users${query}`);
}

