import { serverFetch } from "../core/Server";

const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;


export const getClasses = async (querystring , trainerId= null)=>{

    const url = trainerId ? `/api/classes?${querystring}&trainerId=${trainerId}` : `/api/classes?${querystring}`

    return serverFetch(url)
}

export const  getFamousClasses = async ()=>{
    return serverFetch(`/api/classes/popular`)
}


export const getClassesById = async (classId) => {
    return serverFetch(`/api/classes/${classId}`);
}