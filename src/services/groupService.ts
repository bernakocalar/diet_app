import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Group {
    id: string;
    name: string;
    memberCount: number;
    description: string;
    nextSession?: string;
    image?: string;
    members?: string[]; // Array of user UIDs
}

export const GroupService = {
    // Get groups the user is a member of
    getUserGroups: async (userId: string): Promise<Group[]> => {
        try {
            const groupsRef = collection(db, "groups");
            const q = query(groupsRef, where("members", "array-contains", userId));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Group));
        } catch (error) {
            console.error("Error fetching user groups:", error);
            return [];
        }
    },

    // Get details of a specific group
    getGroupDetails: async (groupId: string): Promise<Group | undefined> => {
        try {
            const docRef = doc(db, "groups", groupId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Group;
            } else {
                return undefined;
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
            return undefined;
        }
    },

    // Join a group (for future use)
    joinGroup: async (groupId: string, userId: string) => {
        try {
            const groupRef = doc(db, "groups", groupId);
            await updateDoc(groupRef, {
                members: arrayUnion(userId),
                memberCount: increment(1)
            });
            return true;
        } catch (error) {
            console.error("Error joining group:", error);
            return false;
        }
    },

    // For testing: Create a group
    // This is optional but helpful if we have no admin panel yet
    /*
    createGroup: async (data: Omit<Group, "id">) => {
        const docRef = await addDoc(collection(db, "groups"), data);
        return docRef.id;
    }
    */
};
