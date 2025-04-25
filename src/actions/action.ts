"use server"

import {profileSchema} from "@/utils/zod-schema";

export const createProfileAction = async(prevState:any, formData:FormData) => {

    try {
        const rawData =Object.fromEntries(formData);
        const validateFields = profileSchema.parse(rawData);
        return {message:'profile created successfully'}
    }catch(error){

        console.log(error)

        return {message:"there was an error"}
    }
    // const firstName = formData.get('firstName') as string;
    // console.log(firstName)
    // return {message:'profile created successfully'}
}