import {describe, it, expect} from 'vitest';
import {createSpendingValidation, updateSpendingValidation} from './validations';
import type {Spending} from '@/generated/prisma/client';
const validInput = {
    amount: '25.50',
    description: 'Milk and bread',
    date: '2026-10-10',
    categoryId: '3',
};

describe('createSpendingValidation', () => {
    it('accepts valid input and converts amount to a number', () => {
        const result = createSpendingValidation.safeParse(validInput);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.amount).toBe(25.5);
        }
    });
});
describe('createSpendingValidation', () => {
    it('accepts valid input and converts amount to a number', () => {
        const result = createSpendingValidation.safeParse(validInput);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.amount).toBe(25.5);
        }
    });

    it('rejects a negative amount', () => {
        const result = createSpendingValidation.safeParse({...validInput, amount: '-50'});
        expect(result.success).toBe(false);
    });

    it('rejects a zero amount', () => {
        const result = createSpendingValidation.safeParse({...validInput, amount: '0'});
        expect(result.success).toBe(false);
    });

    it('rejects a description longer than 200 characters', () => {
        const result = createSpendingValidation.safeParse({...validInput, description: 'a'.repeat(201)});
        expect(result.success).toBe(false);
    });
});

describe('updateSpendingValidation', () => {
    it('rejects input without spendingId', () => {
        const result = updateSpendingValidation.safeParse(validInput);
        expect(result.success).toBe(false);
    });
});
    