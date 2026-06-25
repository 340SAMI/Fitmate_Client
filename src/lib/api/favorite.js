import { serverFetch } from "../core/Server"

export const getFavorite = async (userId, classId=null)=>{
const url = classId ? `/api/favorites?userId=${userId}&classId=${classId}` : `/api/favorites?userId=${userId}`
return serverFetch(url)
}