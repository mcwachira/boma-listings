import React from 'react';
import {auth} from '@clerk/nextjs/server';
import {CardSignInButton} from "@/components/form/Buttons";
import {fetchFavoriteId} from "@/actions/action";
import FavoriteToggleForm from "@/components/card/FavoriteToggleForm";

async function FavoriteToggleButton({propertyId}:{propertyId:string}) {
    const {userId} = await auth();

    if(!userId) return <CardSignInButton/>;


    const favoriteId = await fetchFavoriteId({propertyId});
    console.log(favoriteId)
    return (
   <FavoriteToggleForm  propertyId={propertyId} favoriteId={favoriteId}/>
    );
}

export default FavoriteToggleButton;