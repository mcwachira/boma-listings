"use client"
import React, {useActionState, useEffect} from 'react';
import {toast} from "sonner";
import {actionFunction} from "@/utils/types";


const initialState = {
    message:""
}
function FormContainer({action, children}:{action:actionFunction, children:React.ReactNode}) {

  const [state, formAction] = useActionState(action, initialState)
    useEffect(() => {
        if(state.message !== "") {
            toast("", {description:state.message})
        }
    },[state])
    return (
      <form action={formAction}>{children}</form>
    );
}

export default FormContainer;