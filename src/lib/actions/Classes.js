'use server'

import { serverMutation } from "../core/Server";



export const createClass = async (classData) => {
    return serverMutation(`/api/classes`, classData);
}

export const UpdateClass = async (classData, id, isAdmin = false) => {
    
  const url = isAdmin ? `/api/classes/${id}?isAdmin=true` : `/api/classes/${id}`;
  return serverMutation(url, classData, 'PATCH');
};

export const deleteClass = async (id)=>{
    return serverMutation(`/api/classes/${id}`, {}, 'DELETE')
}