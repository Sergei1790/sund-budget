import {prisma} from '@/lib/prisma';

export default async function seedDemo() {
    const demoUser = await prisma.user.upsert({
        where: {email: 'demo@sund-budget.app'},
        update: {},
        create: {email: 'demo@sund-budget.app', name: 'Demo User'},
    });
    const demoHousehold = await prisma.household.upsert({
        where: {inviteToken: 'demo-household-token'},
        update: {},
        create: {inviteToken: 'demo-household-token', name: 'Demo Family'},
    });
    await prisma.householdMember.upsert({
        where: {householdId_userId: {householdId: demoHousehold.id, userId: demoUser.id}},
        update: {},
        create: {householdId: demoHousehold.id, userId: demoUser.id},
    });
    await prisma.spending.deleteMany({where: {householdId: demoHousehold.id}});
    await prisma.category.deleteMany({where: {householdId: demoHousehold.id}});

    const categoryNames = ['Groceries', 'Transport', 'Bills', 'Eating out', 'Entertainment', 'Other'];
    const categories = [];
    for (const name of categoryNames) {
        const category = await prisma.category.create({
            data: {name, householdId: demoHousehold.id},
        });
        categories.push(category);
    }

    const spendings = [
        {amount: 1250, date: new Date('2026-07-01'), categoryId: categories[0].id, householdId: demoHousehold.id},
        {amount: 2100, date: new Date('2026-07-01'), categoryId: categories[2].id, householdId: demoHousehold.id},
        {amount: 340, date: new Date('2026-07-02'), categoryId: categories[1].id, householdId: demoHousehold.id},
        {amount: 520, date: new Date('2026-07-02'), categoryId: categories[3].id, householdId: demoHousehold.id},
        {amount: 380, date: new Date('2026-07-03'), categoryId: categories[4].id, householdId: demoHousehold.id},
        {amount: 150, date: new Date('2026-07-03'), categoryId: categories[5].id, householdId: demoHousehold.id},
        {amount: 1600, date: new Date('2026-06-05'), categoryId: categories[0].id, householdId: demoHousehold.id},
        {amount: 980, date: new Date('2026-06-18'), categoryId: categories[0].id, householdId: demoHousehold.id},
        {amount: 420, date: new Date('2026-06-10'), categoryId: categories[1].id, householdId: demoHousehold.id},
        {amount: 1950, date: new Date('2026-06-03'), categoryId: categories[2].id, householdId: demoHousehold.id},
        {amount: 740, date: new Date('2026-06-22'), categoryId: categories[3].id, householdId: demoHousehold.id},
        {amount: 310, date: new Date('2026-06-14'), categoryId: categories[3].id, householdId: demoHousehold.id},
        {amount: 600, date: new Date('2026-06-08'), categoryId: categories[4].id, householdId: demoHousehold.id},
        {amount: 220, date: new Date('2026-06-25'), categoryId: categories[5].id, householdId: demoHousehold.id},
        {amount: 280, date: new Date('2026-06-28'), categoryId: categories[1].id, householdId: demoHousehold.id},
    ];

    await prisma.spending.createMany({data: spendings});
}
