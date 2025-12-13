export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    height?: number; // in cm
    weight?: number; // in kg
    target?: 'lose' | 'maintain' | 'gain';
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    selectedPackageId?: string;
    teamId?: string;
}

export interface DietPackage {
    id: string;
    name: string;
    goal: string;
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
