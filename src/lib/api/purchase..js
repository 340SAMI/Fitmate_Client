import { serverFetch } from "../core/Server"

export const getPurchase = async (purchase = null)=>{
    const url = authorId
    ? `/api/purchases?userID=${purchase}`
    : `/api/purchases`;
  return serverFetch(url);
}



export const checkPurchase = async (userId, classId)=>{
    return serverFetch(`/api/purchases/check?userId=${userId}&classId=${classId}`)
}