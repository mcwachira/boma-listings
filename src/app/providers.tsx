 "use client"

 import {ThemeProvider} from "@/components/providers/theme-provider";
 import React from "react";

 function Providers({children}:{children:React.ReactNode}) {
return(
    <>


    <ThemeProvider      attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange>
        {children}
    </ThemeProvider>
    </>
)
 }

 export default Providers;