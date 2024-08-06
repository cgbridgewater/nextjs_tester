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
            // Catch and handle error
            console.error('Login Failed:', error);
            throw new Error("Please check that Username and Password are correct");
        }
    };

    // REGISTRATION FUNCTION
    const register = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/auth', {
                username,
                password,
            });
            await login(username, password); // Automatically log in after registration.
        } catch (error) {
            // Catch and handle error
            console.error('Registration Failed:', error);
            throw new Error(error.response.data.detail);
        }
    };

    // LOGOUT FUNCTION
    const logout = () => {
        setUser(null);
        setUserName("");
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login')
    };

    
    return (
        <AuthContext.Provider value={{ user, userName, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
