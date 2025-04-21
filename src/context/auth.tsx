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
    logout:() => Promise<void>;
    loginInWithGoogle:() => Promise<void>;
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

    const logout = async() => {
        await auth.signOut();
    }

  const loginInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
    }
    return (
    <AuthContext.Provider value={{
        currentUser,
        logout,
        loginInWithGoogle
    }}>
            {children}
        </AuthContext.Provider>
    )
}



export const useAuth = () => useContext(AuthContext);