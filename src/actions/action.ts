"use server"

import {profileSchema} from "@/utils/zod-schema";
import {clerkClient, currentUser} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {redirect} from "next/navigation";

export const createProfileAction = async(prevState:any, formData:FormData) => {

    try {

        const user = await  currentUser();
        if(!user) throw new Error('Please login to create user');
        // console.log(user)
        console.log(Object.keys(prisma));

        const rawData =Object.fromEntries(formData);
        const validatedFields = profileSchema.parse(rawData);

        const users =     await prisma.profile.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? '',
                ...validatedFields,
            },
        });
        console.log(users)
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(user.id, {
            privateMetadata:{
                hasProfile:true
            }
        })

    }catch(error){



        return {message:error instanceof Error ? error.message :"An error occurred" }
    }

    redirect('/')
}


//fetch profile image
export const fetchProfileIMage = async() => {
    const user = await  currentUser();
    if(!user) return null ;
    const profile = await prisma.profile.findUnique({
        where:{
            clerkId: user.id,
        },
        select:{
            profileImage:true
        }
    })

    return profile?.profileImage;
}