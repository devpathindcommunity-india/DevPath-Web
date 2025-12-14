"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    name: string;
    avatar: string;
    xp: number;
    rank: number;
    streak: number;
}

interface AuthContextType {
    user: User | null;
    login: () => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate checking auth state
        const timer = setTimeout(() => {
            // Auto-login for demo purposes
            setUser({
                name: "Alex Chen",
                avatar: "https://github.com/shadcn.png", // Placeholder
                xp: 125400,
                rank: 42,
                streak: 12
            });
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const login = () => {
        setIsLoading(true);
        setTimeout(() => {
            setUser({
                name: "Alex Chen",
                avatar: "https://github.com/shadcn.png",
                xp: 125400,
                rank: 42,
                streak: 12
            });
            setIsLoading(false);
        }, 1000);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
