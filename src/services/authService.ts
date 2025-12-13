import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { UserProfile } from "../types/user";

export const AuthService = {
    // Register new user
    register: async (email: string, pass: string, profileData: Partial<UserProfile>) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // Create user document in Firestore
            const newUser: UserProfile = {
                uid: user.uid,
                email: user.email || "",
                ...profileData
            };

            await setDoc(doc(db, "users", user.uid), newUser);
            return newUser;
        } catch (error) {
            throw error;
        }
    },

    // Login
    login: async (email: string, pass: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    },

    // Get User Profile
    getUserProfile: async (uid: string): Promise<UserProfile | null> => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data() as UserProfile;
            }
            return null;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    },

    // Update User Profile
    updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
        try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, data);
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    }
};
