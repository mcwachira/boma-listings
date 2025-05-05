"use client"
import Title from "@/components/properties/Title";
import React, {useState} from 'react';
import {Button} from "@/components/ui/button";

function Description({description}:{description:string}) {
    const [isFullDescriptionShow, setIsFullDescriptionShow] = useState(false)
    const words = description.split(" ");
    const isLongDescription = words.length > 100;

    const toggleDescription =() => {
        setIsFullDescriptionShow(!isFullDescriptionShow);
    };

    const displayedDescription = isLongDescription && !isFullDescriptionShow ? words.splice(0 , 100).join(" ") + "..." : description;
    return (<article>
            <Title text="Description"/>
            <p className="text-muted-foreground font-light leading-loose">
                {displayedDescription}
            </p>

            {isLongDescription  && <Button variant="link" className="pl-0" onClick={toggleDescription}>
                {isFullDescriptionShow? "Show Less":"Show More"}
            </Button>}
        </article>
    );
}

export default Description;