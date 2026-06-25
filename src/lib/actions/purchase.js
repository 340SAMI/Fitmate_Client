import { serverMutation } from "../core/Server"


export const addPurchase = async (purchaseData)=>{

    return serverMutation('/api/purchases', purchaseData);
}