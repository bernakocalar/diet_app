export interface Group {
    id: string;
    name: string;
    memberCount: number;
    description: string;
    nextSession?: string;
    image?: string;
}

const MOCK_GROUPS: Group[] = [
    {
        id: 'g1',
        name: 'Morning Cardio Crew',
        memberCount: 15,
        description: 'We run every morning at 7 AM.',
        nextSession: 'Tomorrow, 7:00 AM'
    },
    {
        id: 'g2',
        name: 'Keto Warriors',
        memberCount: 42,
        description: 'Support group for Keto diet beginners.',
        nextSession: 'Wed, 8:00 PM'
    },
    {
        id: 'g3',
        name: 'Yoga & Chill',
        memberCount: 28,
        description: 'Relaxing yoga sessions for stress relief.',
        nextSession: 'Fri, 6:00 PM'
    }
];

export const GroupService = {
    getUserGroups: async (userId: string): Promise<Group[]> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [...MOCK_GROUPS];
    },

    getGroupDetails: async (groupId: string): Promise<Group | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_GROUPS.find(g => g.id === groupId);
    }
};
