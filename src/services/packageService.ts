import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { DietPackage } from "../types/package";

export const PackageService = {
    // Fetch all available packages
    getAllPackages: async (): Promise<DietPackage[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, "packages"));
            const packages: DietPackage[] = [];
            querySnapshot.forEach((doc) => {
                packages.push({ id: doc.id, ...doc.data() } as DietPackage);
            });
            return packages;
        } catch (error) {
            console.error("Error fetching packages:", error);
            return [];
        }
    },

    // Assign a package to a user
    assignPackageToUser: async (userId: string, packageId: string) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                packageId: packageId
            });
        } catch (error) {
            throw error;
        }
    },

    // Get a specific package
    getPackageById: async (packageId: string): Promise<DietPackage | null> => {
        try {
            const docRef = doc(db, "packages", packageId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as DietPackage;
            }
            return null;
        } catch (error) {
            console.error("Error fetching package:", error);
            return null;
        }
    }
};
