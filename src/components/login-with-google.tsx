"use client"

import React from 'react';
import {Button} from "@/components/ui/button";
import {GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/firebaseClient';

function LoginWithGoogle() {

    function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
    }
    return (
       <Button onClick={signInWithGoogle}>
           Login with Google
       </Button>
    );
}

export default LoginWithGoogle;