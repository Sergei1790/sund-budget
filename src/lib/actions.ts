'use server';

import {prisma} from '@/lib/prisma';
import {auth} from '@/auth';
import {revalidatePath} from 'next/cache';

export async function createHousehold(formData: FormData) {
    const DEFAULT_CATEGORIES = ['Groceries', 'Household Supplies', 'Bills', 'Clothes', 'Presents', 'Entertainment', 'Other'];
    try {
        const name = formData.get('name') as string;
        if (!name?.trim()) throw new Error('Name required');

        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');

        let user = await prisma.user.findUnique({
            where: {email: session.user.email},
            include: {households: true},
        });
        if (!user) {
            user = await prisma.user.create({
                data: {email: session.user.email},
                include: {households: true},
            });
        }
        if (user.households.length > 0) {
            throw new Error('You are already in a household');
        } else {
            const newHousehold = await prisma.household.create({
                data: {name},
            });
            await prisma.householdMember.create({
                data: {householdId: newHousehold.id, userId: user.id},
            });
            await prisma.category.createMany({
                data: DEFAULT_CATEGORIES.map((cat) => ({
                    name: cat,
                    householdId: newHousehold.id
                })),
            });
        }

        revalidatePath('/');
    } catch (err) {
        console.error('createHousehold failed:', err);
        throw err;
    }
}

export async function createCategory(formData: FormData){
    try {
        const name = formData.get('name') as string;
        if (!name?.trim()) throw new Error('Name required');

        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');

        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
            include: {households: true},
        });
        if (!user) throw new Error('Not authenticated');

        if(!user.households[0]) throw new Error('No household membership exists');
        await prisma.category.create({
            data: {name, householdId: user.households[0].householdId},
        });
        
        revalidatePath('/');
    } catch (err) {
        console.error('createCategory failed:', err);
        throw err;
    }
}