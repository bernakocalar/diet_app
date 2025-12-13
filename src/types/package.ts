export interface DietPackage {
    id: string;
    name: string;
    goal: 'lose_weight' | 'maintain' | 'gain_muscle';
    description: string;
    rules: string[];
    allowedFoods: string[];
    forbiddenFoods: string[];
    sampleDay: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snacks: string[];
    };
}
