"use client"
import React from 'react';
import {SignInButton, useAuth} from "@clerk/nextjs";
import {useProperty} from "@/state/store";
import {Button} from '../ui/button';
import FormContainer from '../form/FormContainer';
import SubmitButton from "@/components/form/Buttons";
import {createBookingAction} from "@/actions/action";

function ConfirmBooking() {


    const {userId} = useAuth();
    const {propertyId, range} = useProperty((state) => state);
    const checkIn = range?.from;
    const checkOut = range?.to;

    //check if user is signed in
    if(!userId){
        return <SignInButton mode={"modal"}>
            <Button type="button" className="w-full" >
                Sign In to Complete Booking
            </Button>
        </SignInButton>
    }

    //setup create booking action
    const createBooking = createBookingAction.bind(null, {
        propertyId, checkIn, checkOut
    })
    return (

        <section>
            <FormContainer action={createBooking}>
<SubmitButton text="Reserve" className="w-full"/>
            </FormContainer>
        </section>
    );
}

export default ConfirmBooking;