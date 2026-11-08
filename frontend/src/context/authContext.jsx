import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users/profile", {
                method: "GET",
                credentials: "include",
            })
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }   
    };

    useEffect(() => {
        refreshUser();
    }, []);
    const logout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users/logout", {
                method: "POST",
                credentials: "include",
            })

            if (response.ok) {
                setUser(null);
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>

    )
};

export const useAuth = () => useContext(AuthContext);