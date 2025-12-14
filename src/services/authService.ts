import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from "../types/user";

// Mock User type to resemble Firebase User
export interface MockUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

let currentUser: MockUser | null = null;
let authStateListeners: ((user: MockUser | null) => void)[] = [];

const notifyListeners = () => {
    authStateListeners.forEach(listener => listener(currentUser));
};

export const AuthService = {
    // Mock OnAuthStateChanged
    onAuthStateChanged: (callback: (user: MockUser | null) => void) => {
        authStateListeners.push(callback);
        // Check local storage for existing session
        AsyncStorage.getItem('mock_user_session').then(json => {
            if (json) {
                currentUser = JSON.parse(json);
            }
            callback(currentUser);
        });

        // Return unsubscribe function
        return () => {
            authStateListeners = authStateListeners.filter(l => l !== callback);
        };
    },

    // Register new user
    register: async (email: string, pass: string, profileData: Partial<UserProfile>) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUid = 'mock-user-' + Math.floor(Math.random() * 10000);
        const newUser: MockUser = {
            uid: mockUid,
            email: email,
            displayName: profileData.displayName || "Mock User",
            photoURL: null
        };

        currentUser = newUser;
        await AsyncStorage.setItem('mock_user_session', JSON.stringify(currentUser));

        // Create user document in "Firestore" (Local imitation)
        const newProfile: UserProfile = {
            uid: mockUid,
            email: email || "",
            ...profileData
        };

        await AsyncStorage.setItem(`user_profile_${mockUid}`, JSON.stringify(newProfile));

        notifyListeners();
        return newProfile;
    },

    // Login
    login: async (email: string, pass: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Allow any login for demo
        const mockUid = 'mock-user-123';
        const user: MockUser = {
            uid: mockUid,
            email: email,
            displayName: "Demo User",
            photoURL: null
        };

        currentUser = user;
        await AsyncStorage.setItem('mock_user_session', JSON.stringify(currentUser));
        notifyListeners();
        return user;
    },

    // Logout
    logout: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        currentUser = null;
        await AsyncStorage.removeItem('mock_user_session');
        notifyListeners();
    },

    // Get User Profile
    getUserProfile: async (uid: string): Promise<UserProfile | null> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const json = await AsyncStorage.getItem(`user_profile_${uid}`);

        if (json) {
            return JSON.parse(json) as UserProfile;
        }

        // If not found, return a default mock profile for convenience
        return {
            uid: uid,
            email: "demo@example.com",
            displayName: "Demo User",
            height: 175,
            weight: 70,
            age: 25,
            gender: "male",
            activityLevel: "moderate",
            target: "maintain",
            packageId: undefined
        } as UserProfile;
    },

    // Update User Profile
    updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const json = await AsyncStorage.getItem(`user_profile_${uid}`);
        let currentProfile = json ? JSON.parse(json) : {};

        const updatedProfile = { ...currentProfile, ...data };
        await AsyncStorage.setItem(`user_profile_${uid}`, JSON.stringify(updatedProfile));
    }
};
