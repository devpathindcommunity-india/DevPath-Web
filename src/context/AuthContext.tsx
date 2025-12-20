"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface User {
    uid: string;
    email: string | null;
    name: string | null;
    photoURL: string | null;
    role: 'admin' | 'member';
    mobile?: string;
    github?: string;
    instagram?: string;
    linkedin?: string;
    bio?: string;
    state?: string;
    city?: string;
    district?: string;
    coverPhotoURL?: string;
    displayRole?: string;
    roleId?: string;
    roleTasks?: string[];
    privacySettings?: {
        showMobile: boolean;
        showLocation: boolean;
        showEmail: boolean;
    };
}

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (data: Partial<User>) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Ensure persistence is set to local
        setPersistence(auth, browserLocalPersistence).catch((error) => {
            console.error("Error setting persistence:", error);
        });

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    let role: 'admin' | 'member' = 'member';
                    let userData: any = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        privacySettings: {
                            showMobile: false,
                            showLocation: true,
                            showEmail: false
                        }
                    };

                    // Check if user is admin (only if email exists)
                    if (firebaseUser.email) {
                        const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.email));
                        if (adminDoc.exists()) {
                            role = 'admin';
                            const data = adminDoc.data();
                            userData = { ...userData, ...data };
                        }
                    }

                    // If not admin, check member
                    if (role === 'member') {
                        const memberDoc = await getDoc(doc(db, 'members', firebaseUser.uid));
                        if (memberDoc.exists()) {
                            const data = memberDoc.data();
                            userData = { ...userData, ...data };
                        }
                    }

                    // Fetch Role Details if roleId exists
                    if (userData.roleId) {
                        try {
                            const roleDoc = await getDoc(doc(db, 'roles', userData.roleId));
                            if (roleDoc.exists()) {
                                const roleData = roleDoc.data();
                                userData = {
                                    ...userData,
                                    displayRole: roleData.title,
                                    roleTasks: roleData.tasks
                                };
                            }
                        } catch (err) {
                            console.error("Error fetching role details:", err);
                        }
                    }

                    setUser({ ...userData, role });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Fallback to basic user data if Firestore fails
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        role: 'member',
                        privacySettings: {
                            showMobile: false,
                            showLocation: true,
                            showEmail: false
                        }
                    });
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateUserProfile = async (data: Partial<User>) => {
        if (!user || !auth.currentUser) return;

        try {
            // 1. Update Firestore
            const collectionName = user.role === 'admin' ? 'admins' : 'members';
            const docId = user.role === 'admin' ? user.email! : user.uid;

            // Remove undefined fields
            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== undefined)
            );

            await setDoc(doc(db, collectionName, docId), cleanData, { merge: true });

            // 2. Update Auth Profile (if name or photoURL changed)
            if (data.name || data.photoURL) {
                // Dynamic import to avoid SSR issues if any, though updateProfile is standard
                const { updateProfile } = await import('firebase/auth');
                await updateProfile(auth.currentUser, {
                    displayName: data.name || auth.currentUser.displayName,
                    photoURL: data.photoURL || auth.currentUser.photoURL
                });
            }

            // 3. Update Local State
            setUser(prev => prev ? { ...prev, ...data } : null);

        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUserProfile, isLoading }}>
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
