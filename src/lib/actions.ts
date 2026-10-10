'use server';

import {prisma} from '@/lib/prisma';
import {auth} from '@/auth';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireHouseholdMember} from '@/lib/household';
import {createSpendingValidation, updateSpendingValidation} from '@/lib/validations';

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
            await prisma.$transaction(async (tx)=>{
                const newHousehold = await tx.household.create({
                    data: {name},
                });
                await tx.householdMember.create({
                    data: {householdId: newHousehold.id, userId: user.id},
                });
                await tx.category.createMany({
                    data: DEFAULT_CATEGORIES.map((cat) => ({
                        name: cat,
                        householdId: newHousehold.id,
                    })),
                });
            });
        }

        revalidatePath('/');
    } catch (err) {
        console.error('createHousehold failed:', err);
        throw err;
    }
}

export async function createCategory(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        if (!name?.trim()) throw new Error('Name required');

        const { householdId } = await requireHouseholdMember();

        await prisma.category.create({
            data: {name, householdId},
        });

        revalidatePath('/');
    } catch (err) {
        console.error('createCategory failed:', err);
        throw err;
    }
}

export async function updateCategory(formData: FormData) {
    try {
        const categoryId = Number(formData.get('categoryId'));
        const name = formData.get('name') as string;
        if (!name?.trim()) throw new Error('Name required');
        if (!categoryId || isNaN(categoryId)) throw new Error('Category required');

        const { householdId } = await requireHouseholdMember();

        const category = await prisma.category.findUnique({where: {id: categoryId}});
        if (!category) throw new Error('No category');
        if (category.householdId !== householdId) throw new Error('Category not in your household');

        await prisma.category.update({
            where: {id: categoryId},
            data: {name},
        });
        revalidatePath('/');
    } catch (err) {
        console.error('updateCategory failed:', err);
        throw err;
    }
}

export async function deleteCategory(formData: FormData) {
    try {
        const categoryId = Number(formData.get('categoryId'));
        if (!categoryId || isNaN(categoryId)) throw new Error('No id sent');

        const { householdId } = await requireHouseholdMember();

        const category = await prisma.category.findUnique({where: {id: categoryId}});
        if (!category) throw new Error('No category');

        if (category.householdId !== householdId) throw new Error('Category not in your household');

        await prisma.category.delete({where: {id: categoryId}});

        revalidatePath('/');
    } catch (err) {
        console.error('deleteCategory failed:', err);
        throw err;
    }
}

export async function createSpending(formData: FormData) {
    try {
        const data = {
            amount : formData.get('amount'),
            description : formData.get('description'),
            date : formData.get('date'),
            categoryId : formData.get('categoryId')
        };
        const result = createSpendingValidation.safeParse(data)
        if(!result.success){
            return { error: result.error.issues[0].message  } 
        }
        const { amount, description, date, categoryId } = result.data;

        const { householdId } = await requireHouseholdMember();
           
        const category = await prisma.category.findUnique({where: {id:categoryId}});
        if (!category) throw new Error('No category');
        if (category.householdId !== householdId) throw new Error('Category not in your household');

        await prisma.spending.create({
            data: {amount, description, date, categoryId, householdId},
        });

        revalidatePath('/');
    } catch (err) {
        console.error('createSpending failed:', err);
        throw err;
    }
}

export async function updateSpending(formData: FormData) {
    try {
        const data = {
            amount : formData.get('amount'),
            description : formData.get('description'),
            date : formData.get('date'),
            categoryId : formData.get('categoryId'),
            spendingId : formData.get('spendingId')
        }
        
        const result = updateSpendingValidation.safeParse(data);
        if(!result.success){
            return { error: result.error.issues[0].message  } 
        }
        const {amount, description, date, categoryId, spendingId} = result.data


        const { householdId } = await requireHouseholdMember();

        const category = await prisma.category.findUnique({where: {id: categoryId}});
        if (!category) throw new Error('No category');
        if (category.householdId !== householdId) throw new Error('Category not in your household');

        const spending = await prisma.spending.findUnique({where: {id: spendingId}});
        if (!spending) throw new Error('No spending');
        if (spending.householdId !== householdId) throw new Error('Spending not in your household');

        await prisma.spending.update({
            where: {id: spendingId},
            data: {
                amount,
                description,
                date,
                categoryId,
            },
        });
        revalidatePath('/');
    } catch (err) {
        console.error('updateSpending failed:', err);
        throw err;
    }
}

export async function deleteSpending(formData: FormData) {
    try {
        const spendingId = Number(formData.get('spendingId'));
        if (!spendingId || isNaN(spendingId)) throw new Error('No id sent');

        const { householdId } = await requireHouseholdMember();

        const spending = await prisma.spending.findUnique({where: {id: spendingId}});
        if (!spending) throw new Error('No spending');

        if (spending.householdId !== householdId) throw new Error('Spending not in your household');

        await prisma.spending.delete({where: {id: spendingId}});

        revalidatePath('/');
    } catch (err) {
        console.error('deleteSpending failed:', err);
        throw err;
    }
}

export async function joinHousehold(formData: FormData) {
    try {
        const inviteToken = formData.get('inviteToken') as string;
        if (!inviteToken) throw new Error('No inviteToken sent');

        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');

        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
            include: {households: true},
        });

        if (!user) throw new Error('Not authenticated');

        if (user.households.length > 0) {
            throw new Error('You are already in a household');
        } else {
            const household = await prisma.household.findUnique({where: {inviteToken}});
            if (!household) throw new Error('Invalid invite');
            await prisma.householdMember.create({
                data: {householdId: household.id, userId: user.id},
            });
        }

        revalidatePath('/');
    } catch (err) {
        console.error('joinHousehold failed:', err);
        throw err;
    }
     redirect('/');
}
