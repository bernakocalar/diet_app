
export interface HistoryEntry {
    id: string;
    date: string;
    weight: number;
    notes?: string;
    calories?: number;
}

const MOCK_HISTORY: HistoryEntry[] = [
    { id: '1', date: '2023-10-01', weight: 80, notes: 'Started diet', calories: 2200 },
    { id: '2', date: '2023-10-08', weight: 79, notes: 'Feeling good', calories: 2100 },
    { id: '3', date: '2023-10-15', weight: 78.5, calories: 2050 },
    { id: '4', date: '2023-10-22', weight: 77.8, notes: 'Cheat meal on Sunday', calories: 2300 },
];

export const HistoryService = {
    getHistory: async (userId: string): Promise<HistoryEntry[]> => {
        // Simulate network
        await new Promise(resolve => setTimeout(resolve, 800));
        return [...MOCK_HISTORY];
    },

    addHistoryEntry: async (entry: Omit<HistoryEntry, 'id'>): Promise<HistoryEntry> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newEntry = { ...entry, id: Math.random().toString(36).substr(2, 9) };
        MOCK_HISTORY.unshift(newEntry);
        return newEntry;
    }
};
