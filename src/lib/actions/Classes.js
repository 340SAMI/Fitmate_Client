'use server'

import { serverMutation } from "../core/Server";



export const createJob = async (classData) => {
    return serverMutation('/api/classes', classData);
}