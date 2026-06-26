'use server'

import { serverMutation } from "../core/Server";



export const createClass = async (classData) => {
    return serverMutation(`/api/classes`, classData);
}

export const modifyClass = async (classData, id)=>{
    return serverMutation(`/api/classes/${id}`, classData, PATCH)
}

export const deleteClass = async (classData, id)=>{
    return serverMutation(`/api/classes/${id}`, classData, DELETE)
}