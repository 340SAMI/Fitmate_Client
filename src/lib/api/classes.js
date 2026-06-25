import { serverFetch } from "../core/Server";

const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;


export const getClasses = async (querystring)=>{
    return serverFetch(`/api/classes?${querystring}`)
}

export const  getFamousClasses = async ()=>{
    return serverFetch(`/api/classes/popular`)
}


export const getClassesById = async (classId) => {
    return serverFetch(`/api/classes/${classId}`);
}