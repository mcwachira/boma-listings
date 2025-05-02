import React from 'react';
import {PropertyCardProps} from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import {formatCurrency} from "@/utils/format";
import PropertyRating from "@/components/card/PropertyRating";
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import CountryFlagAndName from "@/components/card/CountryFlagAndName";

function PropertyCard({property}:{property:PropertyCardProps}) {

    const {name, image, price , country, id:propertyId, tagline} = property;

    return (
      <article className="group relative">
          <Link href={`/properties/${propertyId}`}>
              <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
                  <Image src={image} alt={name} fill sizes='(max-width:768px) 100vw, 50vw)' className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"/>
              </div>

              <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold mt-1">
                      {name.substring(0, 30)}
                  </h3>

                  {/*property rating*/}
                  <PropertyRating inPage={false} propertyId={propertyId}/>
              </div>

              <p className="text-sm font-semibold mt-1">
                  {tagline.substring(0, 40)}
              </p>

              <div className="flex justify-between items-center mt-1">
<p className="text-sm mt-1">
    <span className="font-semibold">
        {formatCurrency(price)}
    </span> night
</p>

                  {/*country and flag*/}

                  <CountryFlagAndName countryCode={country}/>
              </div>
          </Link>

          <div className="absolute top-5 right-5 z-5">
              {/*favourite toggle butt on*/}

              <FavoriteToggleButton propertyId={propertyId}/>
          </div>
      </article>
    );
}

export default PropertyCard;