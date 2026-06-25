import { serverMutation } from "../core/Server"

export const setFavorite = async (favoriteData)=>{
    return serverMutation('/api/favorites', favoriteData)
}


export const deleteFavorite = async (userId, classId) => {
  return serverMutation(`/api/favorites?userId=${userId}&classId=${classId}`, {}, 'DELETE');
}