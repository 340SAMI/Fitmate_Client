import { serverMutation } from "../core/Server"

export const setFavorite = async (favoriteData)=>{
    return serverMutation('/api/favorites', favoriteData)
}