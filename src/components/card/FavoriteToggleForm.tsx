"use client"
import React from 'react';
import {toggleFavoriteAction} from "@/actions/action";
import {usePathname} from "next/navigation";
import FormContainer from "@/components/form/FormContainer";
import {CardSubmitButton} from "@/components/form/Buttons";

type FavoriteToggleFormProps = {
    propertyId:string;
    favoriteId:string | null;
}
function FavoriteToggleForm({propertyId,favoriteId }:FavoriteToggleFormProps) {

    console.log("Favorite Toggle Form", favoriteId)
    const pathname = usePathname();
    const toggleAction = toggleFavoriteAction.bind(null, {
        propertyId,
        favoriteId,
        pathname
    })
    return (
        <FormContainer action={toggleAction}>
            <CardSubmitButton isFavorite={favoriteId ? true : false} />
        </FormContainer>
    );
}

export default FavoriteToggleForm;