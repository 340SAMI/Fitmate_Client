'use server'

import { serverMutation } from "../core/Server";



export const createClass = async (classData) => {
    return serverMutation(`/api/classes${classData}`);
}