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
    packageId?: string; // The diet package they selected
    teamId?: string; // The team they joined
    currentDietId?: string; // The specifically selected diet program (keto, vegan, etc.)
}
