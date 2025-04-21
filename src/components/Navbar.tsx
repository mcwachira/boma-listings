"use client"
import React from 'react';
import Link from "next/link";
import { useAuth } from '@/context/auth';
import {Button} from "@/components/ui/button";

function Navbar(props) {

    const auth  = useAuth()
    return (
<nav className="bg-sky-950 text-white p-5 h-24 flex items-center justify-between">
    <Link href="/">
        Boma Lisitngs
    </Link>


    <div>
        {!!auth.currentUser && (
            <>
            <div>
                {auth.currentUser.email}
            </div>
                <div>
                    <Button onClick={() => auth.logout()}>
                        logout
                    </Button>
                </div>
            </>
        )}
    </div>
    {
        !auth?.currentUser && (

            <>
                <Link href="/login">Login

                </Link>
                <Link href="/register">
                    Sign Up

                </Link>
            </>
        )
    }

</nav>
    );
}

export default Navbar;