import React from 'react';
import {fetchPropertyDetails, findExistingReviews} from "@/actions/action";
import {redirect} from "next/navigation";
import BreadCrumbs from "@/components/properties/BreadCrumbs";
import FavoriteToggleButton from '@/components/card/FavoriteToggleButton';
import ShareButton from "@/components/properties/ShareButton";
import ImageContainer from '@/components/properties/ImageContainer';
import PropertyRating from "@/components/card/PropertyRating";
import PropertyDetails from "@/components/properties/PropertyDetails";
import UserInfo from "@/components/properties/UserInfo";
import {Separator} from "@/components/ui/separator";
import Description from "@/components/properties/Description";
import Amenities from "@/components/properties/Amenities";
import DynamicMapComponent from "@/app/properties/[id]/DynamicMapComponent";
import SubmitReview from "@/components/reviews/SubmitReview";
import PropertyReviews from '@/components/reviews/PropertyReviews';
import {auth} from '@clerk/nextjs/server';
import DynamicBookingWrapperComponent from "@/app/properties/[id]/DynamicBookingWrapperComponent";

type Params = Promise<{ id: string }>
async function PropertyDetailsPage({ params }: { params: Params }) {
    const { id } = await params
    const property = await fetchPropertyDetails(id);
    if(!property) {
        redirect("/")
    }

    const {baths, bedrooms, beds,guests } = property;
    const details = {baths, bedrooms, beds,guests };

    const firstName = property.profile.firstName;
    const profileImage = property.profile.profileImage;

    const {userId} =await auth();
    const isNotOwner = property.profile.clerkId !== userId;
    const reviewDoesNotExist = userId && isNotOwner && !(await findExistingReviews(userId, property.id))

   // console.log(property.bookings);
    return (
        <section>
            <BreadCrumbs name={property.name} />
            <header className='flex justify-between items-center mt-4'>
                <h1 className='text-4xl font-bold '>{property.tagline}</h1>
                <div className='flex items-center gap-x-4'>
                    {/* share button */}
                    <ShareButton name={property.name} propertyId={property.id}/>
                    <FavoriteToggleButton propertyId={property.id} />
                </div>

            </header>
            <ImageContainer mainImage={property.image} name={property.name}/>
            <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
                <div className="lg:col-span-8">

                    <div className="flex gap-x-4 items-center">
                        <h1 className="text-xl font-bold">
                            {property.name}
                        </h1>
                        <PropertyRating inPage propertyId={property.id}/>
                    </div>
                    <PropertyDetails details={details}/>
                    <UserInfo profile={{firstName, profileImage}}/>
                    <Separator className="mt-4"/>
                    <Description description={property.description}/>
                    <Amenities amenities={property.amenities}/>
                    <DynamicMapComponent countryCode={property.country}/>
                </div>

                <div className='lg:col-span-4 flex flex-col items-center'>
                    {/* calendar */}
                 <DynamicBookingWrapperComponent propertyId={property.id} price={property.price} bookings={property.bookings}/>
                </div>
            </section>
            {reviewDoesNotExist && <SubmitReview propertyId={property.id}/>}
            <PropertyReviews propertyId={property.id}/>
        </section>
    );
}

export default PropertyDetailsPage;