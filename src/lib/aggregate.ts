import type {Spending, Category} from '@/generated/prisma/client';
import {format} from 'date-fns';

export function aggregateByCategory(spendings: (Spending & {category: Category})[]) {
    const totals = new Map<string, number>();

    for (const s of spendings) {
        const current = totals.get(s.category.name) ?? 0;
        totals.set(s.category.name, current + Number(s.amount));
    }
    return Array.from(totals, ([name, total]) => ({name, total}));
}

export function aggregateByMonth(spendings: (Spending & {category: Category})[]) {
    const byMonth = new Map<string, (Spending & {category: Category})[]>();

    for (const s of spendings) {
        const monthKey = format(s.date, 'yyyy-MM'); // "2026-06"
        const current = byMonth.get(monthKey) ?? []; // this month's list, or empty
        current.push(s); // add s to the list
        byMonth.set(monthKey, current); // store the list back
    }
    const months = Array.from(byMonth, ([month, items]) => ({
        month,
        items,
        total: items.reduce((acc, s) => acc + Number(s.amount), 0),
    }));
    return months;
}
