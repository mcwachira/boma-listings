import Logo from "@/components/navbar/Logo";
import DarkMode from "@/components/navbar/DarkMode";
import LinksDropDown from "@/components/navbar/LinksDropDown";


import DynamicNavSearchComponent from "@/components/navbar/DynamicNavSearchComponents";

// Dynamically import NavSearch so it's not included in the SSR build
// const NavSearch = dynamic(() => import('@/components/navbar/NavSearch'), {
//     ssr: false,
// });
function Navbar() {
    return (
        <nav className="border-b">
            <div className="container flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap gap-4 py-8">
                <Logo />

<DynamicNavSearchComponent/>

                <div className="flex gap-4 items-center">
                    <DarkMode />
                    <LinksDropDown />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
