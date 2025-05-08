"use client"
import {defaultSelected, generateBlockedPeriods, generateDateRange, generateDisabledDates} from '@/utils/calendar';
import React, {useEffect, useState} from 'react';
import {DateRange} from "react-day-picker";
import {useProperty} from "@/state/store";
import {Calendar} from '../ui/calendar';
import {toast} from 'sonner';

function BookingCalender() {

    const currentDate = new Date();


    //set up the range
    const [range, setRange] =useState<DateRange | undefined>(defaultSelected);
    const bookings = useProperty((state) => state.bookings);

    //generate blocked period
    const blockedPeriods = generateBlockedPeriods({
        bookings, today: currentDate,
    })


    //check  fro unavailable dates
    const unavailableDates = generateDisabledDates(blockedPeriods);

    useEffect(() => {
        const selectedRange = generateDateRange(range);
        const isDisabledDateIncluded = selectedRange.some((date) => {
            if(unavailableDates[date]){
                setRange(defaultSelected);
                toast("", {
                    description: "Some dates are booked please try again"
                });

                return true;
            }

            return false;
        })

        useProperty.setState({range})
    }, [range]);

    //updates state when range is selected
    useEffect(() => {

        useProperty.setState({range})
    }, [range])
    return (
       <Calendar
           mode="range"
           defaultMonth={currentDate}
           selected={range}
           onSelect={setRange}
           className="mb-4"
           disabled={blockedPeriods}
           />
    );
}

export default BookingCalender;