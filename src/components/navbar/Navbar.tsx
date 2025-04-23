import React from 'react';
import Logo from "@/components/navbar/Logo";
import NavSearch from "@/components/navbar/NavSearch";
import DarkMode from "@/components/navbar/DarkMode";
import LinksDropDown from "@/components/navbar/LinksDropDown";

function Navbar(props) {
    return (
      <nav className="border-b">
          <div className="container flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap gap-4 py-8">

              <Logo/>
              <NavSearch/>
              <div className="flex gap-4 items-center">
                  <DarkMode/>
                  <LinksDropDown/>
              </div>          </div>
      </nav>
    );
}

export default Navbar;