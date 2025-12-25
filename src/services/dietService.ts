import { DailyPlan, DietProgram } from '../types/diet';

// Mock Data
const MOCK_PROGRAMS: DietProgram[] = [
    {
        id: 'balanced',
        name: 'Balanced Diet',
        description: 'A well-rounded diet with a mix of macronutrients.',
        icon: 'scale-outline',
        difficulty: 'easy',
        durationWeeks: 4,
        dailyPlans: [
            {
                day: 1,
                totalCalories: 2000,
                meals: [
                    { id: 'm1', name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 60, fat: 6, type: 'breakfast', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400' },
                    { id: 'm2', name: 'Grilled Chicken Salad', calories: 500, protein: 40, carbs: 20, fat: 25, type: 'lunch' },
                    { id: 'm3', name: 'Salmon with Quinoa', calories: 600, protein: 45, carbs: 45, fat: 22, type: 'dinner' },
                    { id: 'm4', name: 'Almonds', calories: 150, protein: 6, carbs: 5, fat: 12, type: 'snack' }
                ]
            }
        ]
    },
    {
        id: 'keto',
        name: 'Keto Diet',
        description: 'High fat, low carb diet for ketosis.',
        icon: 'egg-outline',
        difficulty: 'medium',
        durationWeeks: 4,
        dailyPlans: [
            {
                day: 1,
                totalCalories: 1800,
                meals: [
                    { id: 'k1', name: 'Bacon and Eggs', calories: 450, protein: 25, carbs: 2, fat: 35, type: 'breakfast' },
                    { id: 'k2', name: 'Avocado Salad', calories: 550, protein: 10, carbs: 8, fat: 45, type: 'lunch' },
                    { id: 'k3', name: 'Steak with Butter', calories: 700, protein: 50, carbs: 0, fat: 50, type: 'dinner' }
                ]
            }
        ]
    },
    {
        id: 'vegan',
        name: 'Vegan Diet',
        description: 'Plant-based diet rich in fiber.',
        icon: 'leaf-outline',
        difficulty: 'medium',
        durationWeeks: 4,
        dailyPlans: [
            {
                day: 1,
                totalCalories: 1800,
                meals: [
                    { id: 'v1', name: 'Smoothie Bowl', calories: 400, protein: 10, carbs: 70, fat: 8, type: 'breakfast' },
                    { id: 'v2', name: 'Lentil Soup', calories: 450, protein: 18, carbs: 60, fat: 10, type: 'lunch' },
                    { id: 'v3', name: 'Tofu Stir-fry', calories: 500, protein: 25, carbs: 40, fat: 20, type: 'dinner' }
                ]
            }
        ]
    },
    {
        id: 'paleo',
        name: 'Paleo Diet',
        description: 'Eat like a hunter-gatherer.',
        icon: 'nutrition-outline',
        difficulty: 'hard',
        durationWeeks: 4,
        dailyPlans: [
            {
                day: 1,
                totalCalories: 2000,
                meals: [
                    { id: 'p1', name: 'Fruit Salad', calories: 300, protein: 2, carbs: 70, fat: 1, type: 'breakfast' },
                    { id: 'p2', name: 'Grilled Chicken', calories: 600, protein: 60, carbs: 0, fat: 30, type: 'lunch', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400' },
                    { id: 'p3', name: 'Steak and Veggies', calories: 700, protein: 70, carbs: 10, fat: 40, type: 'dinner' }
                ]
            }
        ]
    }
];

export const DietService = {
    getAllPrograms: async (): Promise<DietProgram[]> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_PROGRAMS), 500);
        });
    },

    getProgramById: async (id: string): Promise<DietProgram | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_PROGRAMS.find(p => p.id === id)), 300);
        });
    },

    getDailyPlan: async (dietId: string, day: number = 1): Promise<DailyPlan | undefined> => {
        return new Promise((resolve) => {
            const program = MOCK_PROGRAMS.find(p => p.id === dietId);
            if (program && program.dailyPlans.length > 0) {
                // For mock, just return the first day always if we don't have enough data
                resolve(program.dailyPlans[0]);
            } else {
                resolve(undefined);
            }
        });
    }
};
