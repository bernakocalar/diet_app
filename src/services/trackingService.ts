// Simple mock service for daily tracking
// In a real app, this would sync with Firestore

export interface DailyStats {
    calories: { current: number; target: number };
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fat: { current: number; target: number };
    water: { current: number; target: number }; // in Liters
    steps: { current: number; target: number };
}

let MOCK_STATS: DailyStats = {
    calories: { current: 1250, target: 2000 },
    protein: { current: 80, target: 150 },
    carbs: { current: 150, target: 200 },
    fat: { current: 40, target: 70 },
    water: { current: 1.5, target: 2.5 },
    steps: { current: 5430, target: 10000 },
};

export const TrackingService = {
    getDailyStats: async (): Promise<DailyStats> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ ...MOCK_STATS }), 200);
        });
    },

    updateWater: async (amountLiters: number): Promise<DailyStats> => {
        return new Promise((resolve) => {
            MOCK_STATS.water.current = parseFloat((MOCK_STATS.water.current + amountLiters).toFixed(2));
            setTimeout(() => resolve({ ...MOCK_STATS }), 200);
        });
    },

    updateSteps: async (steps: number): Promise<DailyStats> => {
        return new Promise((resolve) => {
            MOCK_STATS.steps.current = steps;
            setTimeout(() => resolve({ ...MOCK_STATS }), 200);
        });
    }
};
