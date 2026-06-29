import { serverFetch } from "../core/Server"

export const adminStats = async (adminId)=>{
    return serverFetch(`/api/admin/stats/${adminId}`)
}


export const userStats = async (userId)=>{
    return serverFetch(`/api/user/stats/${userId}`)
}