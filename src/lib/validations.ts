import {z} from 'zod';

export const createSpendingValidation = z.object({
    amount: z.coerce.number('Amount must be a number').positive('Amount must be positive number'),
    description: z.string().trim().max(200, 'Description must be at most 200 characters').optional(),
    date: z.coerce.date('Please choose a valid date'),
    categoryId: z.coerce.number('Please choose a category').int('Please choose a category').positive('Please choose a category'),
});

export const updateSpendingValidation = createSpendingValidation.extend({
    spendingId: z.coerce.number('Please choose a spending').int('Please choose a spending').positive('Please choose a spending')
});