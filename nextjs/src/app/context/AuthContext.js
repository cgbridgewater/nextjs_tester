"use client"

import { createContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loginError, setLoginError] = useState("");
    const [userName, setUserName] = useState("");
    const router = useRouter();

    const login = async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            const response = await axios.post('http://localhost:8000/auth/token', formData, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            localStorage.setItem('token', response.data.access_token);
            setUser(response.data);
            setUserName(username);
            router.push('/');
        } catch (error) {
            console.log('Login Failed:', error);
            setLoginError( error.response.data.detail);
            const modal = new window.bootstrap.Modal(modalRef.current);
            modal.show();
        }
    };

    const logout = () => {
        setUser(null);
        setUserName("");
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login')
    };

    return (
        <AuthContext.Provider value={{ user, userName, login, logout, loginError, setLoginError}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;