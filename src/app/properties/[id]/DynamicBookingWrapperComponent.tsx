"use client"

import dynamic from "next/dynamic";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";
import {Booking} from "@/utils/types";

const DynamicBookingWrapper = dynamic(
    () => import('@/components/booking/BookingWrapper'),
    {
        ssr: false,
        loading: () => <Skeleton className='h-[400px] w-full' />,
    }
);
export default function DynamicBookingWrapperComponent({propertyId, price, bookings}:{propertyId:string, price:number, bookings:Booking[] }){
    return <DynamicBookingWrapper propertyId={propertyId} price={price} bookings={bookings}/>;
}