import * as z from 'zod'
import {ZodSchema}   from "zod";

export const profileSchema = z.object({
    firstName: z.string().min(3, {
        message:"first name must at least have three characters"
    }),
    lastName: z.string().min(3, {
        message:"last name must at least have three characters"
    }),
    username: z.string().min(3, {
        message:"username must at least have three characters"
    }),
})


//helper function to validate our schema
export function validateWithZodSchema<T>(schema:ZodSchema<T>, data:unknown):T{
    const result = schema.safeParse(data);

    if(!result.success ){
        const errors = result.error.errors.map(error => error.message);
        throw new Error(errors.join(","));
    }

return result.data;
}