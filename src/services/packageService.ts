import { DietPackage } from "../types/package";
import { AuthService } from "./authService";

// Mock Data
const MOCK_PACKAGES: DietPackage[] = [
    {
        id: "pkg_basic",
        name: "Basic Wellness",
        goal: "maintain",
        description: "A balanced diet for maintaining healthy weight.",
        rules: ["Drink 2L water", "No process sugar"],
        allowedFoods: ["Vegetables", "Lean meat", "Fruits"],
        forbiddenFoods: ["Fast food", "Soda"],
        sampleDay: {
            breakfast: "Oatmeal with berries",
            lunch: "Grilled chicken salad",
            dinner: "Steamed fish with veggies",
            snacks: ["Almonds", "Apple"]
        }
    },
    {
        id: "pkg_weight_loss",
        name: "Rapid Weight Loss",
        goal: "lose_weight",
        description: "High protein, low carb plan for effective weight loss.",
        rules: ["No carbs after 6PM", "High protein intake"],
        allowedFoods: ["Chicken breast", "Eggs", "Green leafy veg"],
        forbiddenFoods: ["Rice", "Bread", "Sugar"],
        sampleDay: {
            breakfast: "3 Boiled Eggs",
            lunch: "Tuna Salad",
            dinner: "Grilled Chicken Breast",
            snacks: ["Protein Shake"]
        }
    },
    {
        id: "pkg_muscle",
        name: "Muscle Gain",
        goal: "gain_muscle",
        description: "Calorie surplus with high protein for muscle building.",
        rules: ["Eat every 3 hours", "Pre/Post workout meals"],
        allowedFoods: ["Red meat", "Rice", "Potatoes", "Chicken"],
        forbiddenFoods: ["Empty calories"],
        sampleDay: {
            breakfast: "4 Eggs + Oatmeal",
            lunch: "Steak and Rice",
            dinner: "Salmon and Potatoes",
            snacks: ["Greek Yogurt", "Protein Bar"]
        }
    }
];

export const PackageService = {
    // Fetch all available packages
    getAllPackages: async (): Promise<DietPackage[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_PACKAGES;
    },

    // Assign a package to a user
    assignPackageToUser: async (userId: string, packageId: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`[Mock] Assigned package ${packageId} to user ${userId}`);
        // In a real mock with state, we would update the user profile in AsyncStorage here.
        // For now, let's assume the UI handles the optimism or we trust the auth service update.

        // Let's actually try to update the profile if possible, strictly speaking
        // But since AuthService handles profile updates, this service might just be a logical wrapper.
        // We can just log it for now as the specialized user update is handled in AuthService usually? 
        // Wait, packageService calls updateDoc on users.

        // We should replicate that update in Firestore via AuthService
        await AuthService.updateUserProfile(userId, { packageId });
    },

    // Get a specific package
    getPackageById: async (packageId: string): Promise<DietPackage | null> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return MOCK_PACKAGES.find(p => p.id === packageId) || null;
    }
};
