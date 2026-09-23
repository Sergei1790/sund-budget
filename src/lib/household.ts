import {cache} from 'react';
import {auth} from '@/auth';
import {prisma} from '@/lib/prisma';

export const getHousehold = cache(async () => {
    const session = await auth();
    if (!session?.user?.email) return null;
    const dbUser = await prisma.user.findUnique({
        where: {email: session.user.email},
        include: {
            households: {
                include: {
                    household: {
                        include: {
                            categories: true,
                            spendings: {include: {category: true}, orderBy: {date: 'desc'}},
                        },
                    },
                },
            },
        },
    });
    return dbUser?.households[0]?.household ?? null;
});

export async function requireHouseholdMember(){
        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');

        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
            include: {households: true},
        });

        if (!user) throw new Error('Not authenticated');
        if (!user.households[0]) throw new Error('No household membership exists');

    return{householdId:user.households[0].householdId}
}
