"use client"

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ childern }) => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() =>{
        if (!user) {
            router.push('/login')
        }
    }, [user, router]);

    return user ? childer : null;
};

export default ProtectedRoute;