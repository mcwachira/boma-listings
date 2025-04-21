import React from 'react';
import Link from "next/link";

function Navbar(props) {
    return (
<nav className="bg-sky-950 text-white p-5 h-24 flex items-center justify-between">
    <Link href="/">
        Boma Lisitngs
    </Link>

    <ul>
        <li>
            <Link href="/login">Login

            </Link>
        </li>
        <li>Sign up</li>
    </ul>
</nav>
    );
}

export default Navbar;