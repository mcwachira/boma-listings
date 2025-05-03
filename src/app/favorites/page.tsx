import {fetchFavorites} from '@/actions/action';
import React from 'react';
import EmptyList from "@/components/home/EmptyList";
import PropertiesList from "@/components/home/PropertiesList";

async function FavouritesPage() {
    const favorites = await fetchFavorites();
    if(favorites.length === 0) {
        return <EmptyList/>
    }
    return (
<PropertiesList  properties={favorites}/>
    );
}

export default FavouritesPage;