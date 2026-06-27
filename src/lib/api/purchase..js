import { serverFetch } from "../core/Server"

export const getPurchase = async (userId = null, classId = null) => {
  const url =
    userId && classId
      ? `/api/purchases?userId=${userId}&classId=${classId}`
      : userId
      ? `/api/purchases?userId=${userId}`
      : classId
      ? `/api/purchases?classId=${classId}`
      : "/api/purchases";

  return serverFetch(url);
};


export const checkPurchase = async (userId, classId)=>{
    return serverFetch(`/api/purchases/check?userId=${userId}&classId=${classId}`)
}