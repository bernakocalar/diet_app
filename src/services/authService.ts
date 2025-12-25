import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../config/firebase";
import { UserProfile } from "../types/user";

export const AuthService = {
    // Listen to Auth State Changes
    onAuthStateChanged: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    },

    // Register new user
    register: async (email: string, pass: string, profileData: Partial<UserProfile>) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Update display name in Auth
        if (profileData.displayName) {
            await updateProfile(user, { displayName: profileData.displayName });
        }

        const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            ...profileData
        };

        // Create user document in Firestore
        // We use setDoc with merge: true to be safe, though initially it's fresh
        await setDoc(doc(db, "users", user.uid), newProfile);

        return newProfile;
    },

    // Login
    login: async (email: string, pass: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return userCredential.user;
    },

    // Logout
    logout: async () => {
        await signOut(auth);
    },

    // Get User Profile from Firestore
    getUserProfile: async (uid: string): Promise<UserProfile | null> => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        } else {
            console.warn("User profile not found in Firestore for uid:", uid);
            return null;
        }
    },

    // Update User Profile in Firestore
    updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
        const docRef = doc(db, "users", uid);
        // We use set with merge mostly, but updateDoc is stricter (fails if doc doesn't exist).
        // Since we create doc on signup, updateDoc is appropriate.
        await updateDoc(docRef, data);
    },

    // Upload Profile Image
    uploadProfileImage: async (uid: string, uri: string): Promise<string> => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const fileRef = ref(storage, `profile_images/${uid}`);
            await uploadBytes(fileRef, blob);

            const photoURL = await getDownloadURL(fileRef);

            // Update Auth Profile
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { photoURL });
            }

            // Update Firestore Profile (if you store it there too)
            // Ideally we should keep them in sync, checking if UserProfile has photoURL field
            // user.photoURL is the main source for auth, but good to have in DB

            return photoURL;
        } catch (error) {
            console.error("Error uploading profile image: ", error);
            throw error;
        }
    }
};
