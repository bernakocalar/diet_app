import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { DietPackage } from "../types/package";

const samplePackages: Omit<DietPackage, 'id'>[] = [
    {
        name: "Mediterranean Balance",
        goal: "lose_weight",
        description: "A balanced heart-healthy diet rich in vegetables, fruits, and healthy fats.",
        rules: [
            "Eat 5 servings of vegetables daily",
            "Use olive oil as primary fat",
            "Limit red meat to once a week",
            "No sugary drinks"
        ],
        allowedFoods: ["Olive oil", "Fish", "Vegetables", "Fruits", "Nuts", "Whole grains"],
        forbiddenFoods: ["Processed meats", "Refined sugar", "Butter", "White bread"],
        sampleDay: {
            breakfast: "Oatmeal with berries and walnuts",
            lunch: "Grilled chicken salad with olive oil dressing",
            dinner: "Baked salmon with quinoa and steamed broccoli",
            snacks: ["Apple", "Almonds"]
        }
    },
    {
        name: "Keto Power",
        goal: "lose_weight",
        description: "Low carb, high fat diet to induce ketosis.",
        rules: [
            "Keep net carbs under 20g/day",
            "High fat intake",
            "Moderate protein",
            "No fruits except berries"
        ],
        allowedFoods: ["Meat", "Fish", "Eggs", "Butter", "Cheese", "Avocado", "Leafy greens"],
        forbiddenFoods: ["Rice", "Pasta", "Bread", "Potatoes", "Sugar", "Bananas"],
        sampleDay: {
            breakfast: "Eggs fried in butter with bacon",
            lunch: "Tuna salad with mayo and avocado",
            dinner: "Steak with excessive butter and asparagus",
            snacks: ["Cheese cubes", "Macadamia nuts"]
        }
    },
    {
        name: "Muscle Mass",
        goal: "gain_muscle",
        description: "High protein calorie surplus to build muscle.",
        rules: [
            "Eat 1g protein per lb of body weight",
            "Caloric surplus of 300-500 kcal",
            "Carbs around workout",
            "Eat every 3-4 hours"
        ],
        allowedFoods: ["Chicken breast", "Rice", "Potatoes", "Lean beef", "Eggs", "Oats"],
        forbiddenFoods: ["Alcohol", "Junk food", "Empty calories"],
        sampleDay: {
            breakfast: "3 Eggs and large bowl of oatmeal",
            lunch: "Chicken breast, rice, and broccoli",
            dinner: "Lean beef pasta with tomato sauce",
            snacks: ["Protein shake", "Greek yogurt"]
        }
    }
];

export const seedPackages = async () => {
    const colRef = collection(db, "packages");
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
        console.log("Packages already exist. Skipping seed.");
        return;
    }

    console.log("Seeding packages...");
    for (const pkg of samplePackages) {
        await addDoc(colRef, pkg);
    }
    console.log("Seeding complete.");
};
