"use client"
import React from 'react';
import {useProperty} from "@/state/store";
import BookingForm from "@/components/booking/BookingForm";
import ConfirmBooking from '@/components/booking/ConfirmBooking';


function BookingContainer() {

    const {range} = useProperty((state => state));

    if(!range || !range.from || !range.to) return null;

    //checks if time is equal and returns null
    if(range.to.getTime() === range.from.getTime()) return null;

    return (
      <div className="w-full">
          <BookingForm />
          <ConfirmBooking />
      </div>
    );
}

export default BookingContainer;