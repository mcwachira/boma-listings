"use client"
import {useProperty} from "@/state/store";
import {Booking} from "@/utils/types"
import BookingContainer from "@/components/booking/BookingContainer"
import BookingCalender from "@/components/booking/BookingCalender";
import {useEffect} from "react";

type BookingWrapperProps = {
    propertyId:string;
    price:number;
    bookings:Booking[];
}
function BookingWrapper({ propertyId,price,bookings}:BookingWrapperProps) {

    //on initial render  the values will be fetched from state
    useEffect(() => {
        useProperty.setState({
            propertyId,
            price,
            bookings,
        })
    }, [])
    return (
        <>
        <BookingCalender/>
            <BookingContainer/>
        </>
    );
}

export default BookingWrapper;