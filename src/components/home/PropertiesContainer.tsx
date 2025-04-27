import React from 'react';
import {PropertyCardProps} from "@/utils/types";
import {fetchProperties} from "@/actions/action";
import EmptyList from './EmptyList';
import PropertiesList from './PropertiesList';

async function PropertiesContainer({category ,search}:{category?:string, search?:string}) {

    const properties:PropertyCardProps[] = await fetchProperties({category, search});

    if(properties.length === 0) {
        return(
            <EmptyList heading="No results" message="Try Changing or Removing some of your Filters" btnText="Clear filters" />
        )
    }
    return (
  <PropertiesList properties={properties}/>
    );
}

export default PropertiesContainer;