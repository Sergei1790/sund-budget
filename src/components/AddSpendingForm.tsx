'use client';
import type {Category} from '@/generated/prisma/client';

import {createSpending} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import DatePicker from '@/components/DatePicker';
import {toast} from 'sonner';

interface Props {
    categories: Category[];
}

export default function AddSpendingForm({categories}: Props) {
    return (
        <form
            action={async (formData) => {
                try {
                    await createSpending(formData);
                    toast.success('Spending added');
                } catch {
                    toast.error('Failed to add spending');
                }
            }}
            className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="date">Date</Label>
                    <DatePicker name="date" />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="categoryId">Category</Label>
                <select id="categoryId" name="categoryId" required className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="description">
                    Description <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input id="description" name="description" placeholder="What was it for?" />
            </div>
            <Button type="submit" className="w-full">
                Add spending
            </Button>
        </form>
    );
}
