import React from "react";


export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
  <div className="max-w-scren-sm mx-auto p-5">

            {children}


  </div>
    );
}
