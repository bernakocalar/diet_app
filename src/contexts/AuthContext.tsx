import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import { UserProfile } from '../types/user';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (uid: string) => {
        try {
            const profile = await AuthService.getUserProfile(uid);
            setUserProfile(profile);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setUserProfile(null);
        }
    };

    useEffect(() => {
        const unsubscribe = AuthService.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser.uid);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.uid);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
