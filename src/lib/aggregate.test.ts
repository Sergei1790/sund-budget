import {describe, it, expect} from 'vitest';
import {aggregateByCategory, aggregateByMonth} from './aggregate';
import type {Spending, Category} from '@/generated/prisma/client';

describe('aggregateByCategory', () => {
    it('sums amounts per category', () => {
        const spendings = [
            {category: {name: 'Groceries'}, amount: 100},
            {category: {name: 'Bills'}, amount: 50},
            {category: {name: 'Groceries'}, amount: 30},
        ] as unknown as (Spending & {category: Category})[];;  
        expect(aggregateByCategory(spendings)).toEqual([
            {name: 'Groceries', total: 130},
            {name: 'Bills', total: 50},
        ]);
    });

    it('returns empty array for no spendings', () => {
        expect(aggregateByCategory([])).toEqual([]);
    });
});
describe('aggregateByMonth', () => {
    it('groups by month with totals, newest first', () => {
        const spendings = [
            {date: new Date('2026-06-15'), amount: 100, category: {name: 'X'}},
            {date: new Date('2026-06-02'), amount: 40, category: {name: 'Y'}},
            {date: new Date('2026-05-20'), amount: 30, category: {name: 'Z'}},
        ] as unknown as (Spending & {category: Category})[];

        const result = aggregateByMonth(spendings);

        expect(result).toHaveLength(2);                          // 2 months
        expect(result[0]).toMatchObject({month: '2026-06', total: 140});
        expect(result[1]).toMatchObject({month: '2026-05', total: 30});
    });
});