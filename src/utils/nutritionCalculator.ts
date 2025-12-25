import { UserProfile } from "../types/user";

export const NutritionCalculator = {
    // Water Calculation: Weight (kg) * 35 ml
    calculateWaterTarget: (weightKg?: number): number => {
        if (!weightKg) return 2.5; // Default if no weight
        const ml = weightKg * 35;
        // Return in Liters, rounded to 1 decimal
        return parseFloat((ml / 1000).toFixed(1));
    },

    // BMR Calculation (Mifflin-St Jeor)
    calculateDailyCalories: (profile?: UserProfile): number => {
        if (!profile || !profile.weight || !profile.height || !profile.age || !profile.gender) {
            return 2000; // Default
        }

        let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
        if (profile.gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        // Activity Multiplier (Simplified)
        // sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725
        const activityMultipliers: Record<string, number> = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };

        const multiplier = activityMultipliers[profile.activityLevel || 'moderate'] || 1.55;
        let tdee = bmr * multiplier;

        // Goal Adjustment
        if (profile.target === 'lose') return Math.round(tdee - 500);
        if (profile.target === 'gain') return Math.round(tdee + 500);
        return Math.round(tdee);
    },

    // Macro Calculation based on diet type
    calculateMacros: (calories: number, dietType: string = 'balanced'): { protein: number, carbs: number, fat: number } => {
        let ratios = { p: 0.3, c: 0.4, f: 0.3 }; // Default Balanced

        if (dietType === 'keto') {
            ratios = { p: 0.25, c: 0.05, f: 0.7 };
        } else if (dietType === 'vegan') {
            ratios = { p: 0.2, c: 0.5, f: 0.3 };
        } else if (dietType === 'paleo') {
            ratios = { p: 0.4, c: 0.2, f: 0.4 };
        }

        // Calories per gram: Protein=4, Carbs=4, Fat=9
        return {
            protein: Math.round((calories * ratios.p) / 4),
            carbs: Math.round((calories * ratios.c) / 4),
            fat: Math.round((calories * ratios.f) / 9),
        };
    }
};
