"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react"
import {
    GoogleAuthProvider,
    ParsedToken,
    signInWithEmailAndPassword,
    signInWithPopup,
    User,
} from "firebase/auth";
import {auth} from "@/firebase/firebaseClient";



type AuthContextType = {
    currentUser:User | null;
}
const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({children}:{children:ReactNode}) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user ?? null);
        })

        return () => unsubscribe();
    })
    return (
    <AuthContext.Provider value={{
        currentUser,
    }}>
            {children}
        </AuthContext.Provider>
    )
}



export const useAuth = () => useContext(AuthContext);