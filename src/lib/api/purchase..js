import { serverFetch } from "../core/fetch";


export const getPurchase = async (userId = null, classId = null, queryString = "") => {
  const parts = [];
  if (userId) parts.push(`userId=${userId}`);
  if (classId) parts.push(`classId=${classId}`);
  if (queryString) parts.push(queryString);
  const url = `/api/purchases${parts.length ? `?${parts.join("&")}` : ""}`;
  return serverFetch(url);
};


export const checkPurchase = async (userId, classId)=>{
    return serverFetch(`/api/purchases/check?userId=${userId}&classId=${classId}`)
}