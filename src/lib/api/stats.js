import { serverFetch } from "../core/Server"

export const adminStats = async (adminId)=>{
    return serverFetch(`/api/admin/stats/${adminId}`)
}