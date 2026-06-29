import { protectedFetch } from "../core/protected";


export const getApplication = async ()=>{
    return protectedFetch("/api/application");
}