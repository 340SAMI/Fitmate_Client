import { ProtectedMutation } from "../core/protected"


export const AddApplication = async (data)=>{
    return ProtectedMutation(`/api/application`, data)
}


export const ApplicationResult = async (id, data)=>{

    return ProtectedMutation(`/api/application/${id}`,data, 'PATCH')
}