"use server"

import {profileSchema} from "@/utils/zod-schema";
import {Auth, clerkClient, currentUser} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";



const getAuthUser = async () => {
    const user = await currentUser();
    if (!user) {
        throw new Error('You must be logged in to access this route');
    }
    if (!user.privateMetadata.hasProfile) redirect('/profile/create');
    return user;
};

const renderError = (error:unknown):{message:string} => {
    console.log(error);

        return {message:error instanceof Error ? error.message :"An error occurred" }

}

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

renderError(error)
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

export const fetchProfile = async() => {
    const user = await  getAuthUser()

    const profile = await prisma.profile.findUnique({
        where:{
            clerkId: user.id,
        }
    })

    if(!profile) redirect('/profile/create');

    return profile;
}

export const updateProfileAction = async(prevState:any, formData:FormData):Promise<{message:string}> => {

    const user  = await getAuthUser();
    try{
        const rawData =Object.fromEntries(formData);
        const validatedFields = profileSchema.parse(rawData);

        const updatedProfile = await prisma.profile.update({
            where:{
                clerkId:user.id
            },
            data:validatedFields,
        })

        revalidatePath('/profile')

        return {message:'profile updated successfully'}
    }catch(error){

        renderError(error)
    }




}