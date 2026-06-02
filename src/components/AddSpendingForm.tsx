'use client';
import type {Category} from '@/generated/prisma/client';

import {createSpending} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

interface Props {
  categories: Category[]
}

export default function AddSpendingForm({categories}: Props) {
    return (
        <form action={createSpending} className="space-y-3 max-w-sm">
            <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" name="amount" placeholder="Amount" type="number" step="0.01" required />
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" placeholder="Date" type="date" required />
                <Label htmlFor="categoryId">Category</Label>
                <select id="categoryId" name="categoryId" required>
                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="Description" />
            </div>
            <Button type="submit">Create spending</Button>
        </form>
    );
}
