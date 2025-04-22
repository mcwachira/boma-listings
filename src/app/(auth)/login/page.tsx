import LoginWithGoogle from "@/components/login-with-google";
import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function Login(){


    return (

            <Card>
                <CardHeader >
                    <CardTitle className="text-3xl font-bold">Login</CardTitle>
                </CardHeader>

                <CardContent>
                    <LoginWithGoogle/>
                </CardContent>
            </Card>
        )

}