import { serverFetch } from "../core/fetch";


const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;


export const getClasses = async (querystring, trainerId = null, isAdmin = false) => {
  const url = trainerId
    ? `/api/classes?${querystring}&trainerId=${trainerId}`
    : isAdmin
    ? `/api/classes?${querystring}&isAdmin=true`
    : `/api/classes?${querystring}`;

    console.log(url)

  return serverFetch(url);
};

export const  getFamousClasses = async ()=>{
    return serverFetch(`/api/classes/popular`)
}


export const getClassesById = async (classId) => {
    return serverFetch(`/api/classes/${classId}`);
}