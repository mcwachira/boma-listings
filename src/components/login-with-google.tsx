"use client"

import React from 'react';
import {Button} from "@/components/ui/button";

import {useAuth} from "@/context/auth";

function LoginWithGoogle() {

    const auth  = useAuth()
    return (

       <Button onClick={() => auth.loginInWithGoogle()} className="w-full">
           Login with Google
       </Button>
    );
}

export default LoginWithGoogle;