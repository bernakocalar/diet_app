export interface Meal {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    image?: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyPlan {
    day: number; // 1 to 7
    meals: Meal[];
    totalCalories: number;
}

export interface DietProgram {
    id: string;
    name: string;
    description: string;
    icon: string; // Ionicons name
    difficulty: 'easy' | 'medium' | 'hard';
    durationWeeks: number;
    dailyPlans: DailyPlan[]; // Ideally this would be fetched separately, but for mock putting it here
}
