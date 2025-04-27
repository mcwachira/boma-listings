"use server"

import {imageSchema, profileSchema, propertySchema, validateWithZodSchema} from "@/utils/schemas";
import {auth, clerkClient, currentUser} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {uploadImage} from "@/utils/supabase";



const getAuthUser = async () => {

    const user = await currentUser();
    console.log("User:", user);
    // const { userId } = await auth()
    if (!user) {
        throw new Error('You must be logged in to access this route');
    }
    if (!user?.privateMetadata.hasProfile) redirect('/profile/create');
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
        const validatedFields = validateWithZodSchema(profileSchema, rawData);

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

return renderError(error)
    }

    redirect('/')
}


//fetch profile image
export const fetchProfileImage = async() => {
    const user = await  getAuthUser()
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
        const validatedFields = validateWithZodSchema(profileSchema, rawData);


 await prisma.profile.update({
            where:{
                clerkId:user.id
            },
            data:validatedFields,
        })

        revalidatePath('/profile')

        return {message:'profile updated successfully'}
    }catch(error){

        return renderError(error)
    }

}

export const updateProfileImageAction = async(prevState:any, formData:FormData):Promise<{message:string}> => {

    const user = await getAuthUser();
    try {
        const image = formData.get("image") as File;
        const validateFields = validateWithZodSchema(imageSchema, {image})
        const fullPath = await uploadImage(validateFields.image);
await prisma.profile.update({
    where:{
        clerkId:user.id,
    },
    data:{
        profileImage:fullPath,
    }
})

        revalidatePath('/profile');
return {message:"profile updated successfully"}
    }catch(error){
        return renderError(error)
    }

}


export const createPropertyAction = async(prevState:any, formData:FormData):Promise<{message:string}> => {

    const user = await getAuthUser();

    try{

        const rawData =Object.fromEntries(formData);
        const file = formData.get("image") as File;
        const validatedFields = validateWithZodSchema(propertySchema, rawData);
        const validatedFile = validateWithZodSchema(imageSchema, {image:file});
        const fullPath = await uploadImage(validatedFile.image);
        await prisma.property.create({
            data:{
                ...validatedFields,
                image:fullPath,
                profileId:user.id
            }
        })



    }catch(error){
        return renderError(error)
    }

    redirect('/')
}


export const fetchProperties = async({search="", category}:{search?:string, category?:string}) => {

    const properties = await prisma.property.findMany({
        where:{
            category,
            OR:[
                {name:{contains:search, mode:"insensitive"}},
                {tagline:{contains:search, mode:"insensitive"}},
            ]
        },
        select:{
            id:true,
            name:true,
            tagline:true,
            price:true,
        },
        orderBy:{
            createdAt:"desc",
        }
    })

    return properties;
}