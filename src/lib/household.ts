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
