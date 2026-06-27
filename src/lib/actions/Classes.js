'use server'

import { serverMutation } from "../core/Server";



export const createClass = async (classData) => {
    return serverMutation(`/api/classes`, classData);
}

export const UpdateClass = async (classData, id)=>{
    return serverMutation(`/api/classes/${id}`, classData, 'PATCH')
}

export const deleteClass = async (id)=>{
    return serverMutation(`/api/classes/${id}`, {}, 'DELETE')
}