"use client"
import React from 'react';
import Link from "next/link";
import { useAuth } from '@/context/auth';
import {Button} from "@/components/ui/button";
import {HomeIcon} from "lucide-react";
import {DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';

function Navbar() {

    const auth  = useAuth()
    const router = useRouter();
    return (
<nav className="bg-sky-950 text-white p-5 h-24 flex items-center justify-between">
    <Link href="/" className="text-3xl tracking-widest flex gap-2 items-center uppercase">

        <HomeIcon className="h-8 w-8" />
        <span>
                   Boma Listings
        </span>

    </Link>

    <ul className="flex gap-6 items-center">

        <li>
            <Link href="/property-listing" className="uppercase tracking-widest hover:underline">
               Property Search
            </Link>
        </li>




        <li>


        {!!auth?.currentUser && (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        {!!auth.currentUser.photoURL && (
                            <AvatarImage src={auth.currentUser.photoURL}
                                         alt={`${auth.currentUser.displayName} avatar`} className="h-70 w-70" />
                        )}

                        <AvatarFallback>
                            {(auth.currentUser.displayName || auth.currentUser.email?.[0] )}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        <div>{auth.currentUser.displayName}</div>
                        <div className="font-normal text-xs">
                            {auth.currentUser.email}
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    {!!auth.customClaims?.admin && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin-dashboard">Admin Dashboard</Link>
                        </DropdownMenuItem>
                    )}
                    {!auth.customClaims?.admin && (
                        <DropdownMenuItem asChild>
                            <Link href="/account/my-favourites">My Favourites</Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        onClick={async () => {
                            await auth.logout();
                            router.refresh();
                        }}
                    >
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        )}

    {
        !auth?.currentUser && (



            <div className="flex gap-2 items-center">
                <Link
                    href="/login"
                    className="uppercase tracking-widest hover:underline"
                >
                    Login
                </Link>
                <div className="h-8 w-[1px] bg-white/50" />
                <Link
                    href="/register"
                    className="uppercase tracking-widest hover:underline"
                >
                    Signup
                </Link>
            </div>

        )
    }
        </li>
    </ul>
</nav>
    );
}

export default Navbar;