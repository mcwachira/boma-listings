"use client"

import React from 'react';
import {Button} from "@/components/ui/button";
import {GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/firebaseClient';
import {useAuth} from "@/context/auth";

function LoginWithGoogle() {

    const auth  = useAuth()
    return (
       <Button onClick={() => auth.loginInWithGoogle()}>
           Login with Google
       </Button>
    );
}

export default LoginWithGoogle;