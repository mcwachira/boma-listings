"use client"
import React, {useState} from 'react';
import {amenities, Amenity} from "@/utils/amenities";
import {Checkbox} from "@/components/ui/checkbox";

function AmenitiesInput({defaultValue}:{defaultValue?:Amenity[]}) {

    const amenitiesWithIcons = defaultValue?.map(({name, selected}) => {
        return {
            name,
             selected,
            icon: amenities.find((amenity) => amenity.name === name)!.icon,
    }
    })
    const [selectedAmenity, setSelectedAmenity] = useState<Amenity[]>(amenitiesWithIcons || amenities);

    const handleChange = (amenity:Amenity) => {
        setSelectedAmenity((prev => {
            return prev.map((a) => {
                if(a.name === amenity.name){
                    return {
                        ...a, selected:!a.selected
                    }
                }

                return a;
            })
        }));
    }
    return (
<section>
    <input type="hidden" name="amenities" value={JSON.stringify(selectedAmenity)} />

    <div className="grid grid-cols-2 gap-4">

        {selectedAmenity.map((amenity) => {
            return <div key={amenity.name} className="flex items-center space-x-2">
                <Checkbox id={amenity.name} checked={amenity.selected} onCheckedChange={()=>{handleChange(amenity)}}/>
                <label htmlFor={amenity.name} className="text-sm font-medium leading-none capitalize flex gap-x-2 items-center">
                    {amenity.name} <amenity.icon className="h-6 w-6" />
                </label>
            </div>
        })}
    </div>
</section>
    );
}

export default AmenitiesInput;