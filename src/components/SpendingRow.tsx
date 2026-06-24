'use client';
import type {Category, Spending} from '@/generated/prisma/client';
import {useState} from 'react';
import {updateSpending, deleteSpending} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import DatePicker from '@/components/DatePicker';
import formatCurrency from '@/lib/format';
import {Pencil, Trash2} from 'lucide-react';
import {toast} from 'sonner';

interface Props {
    spending: Omit<Spending, 'amount'> & {amount: number; category: Category};
    categories: Category[];
}

export default function SpendingRow({spending, categories}: Props) {
    const [editing, setEditing] = useState(false);

    if (editing) {
        return (
            <li className="py-4">
                <form
                    action={async (formData) => {
                        try {
                            await updateSpending(formData);
                            toast.success('Spending updated');
                            setEditing(false);
                        } catch {
                            toast.error('Failed to update spending');
                        }
                    }}
                    className="space-y-4 rounded-lg border border-border bg-card/50 p-4">
                    <input type="hidden" name="spendingId" value={spending.id} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor={`amount-${spending.id}`}>Amount</Label>
                            <Input id={`amount-${spending.id}`} name="amount" type="number" step="0.01" defaultValue={spending.amount} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor={`date-${spending.id}`}>Date</Label>
                            <DatePicker name="date" defaultDate={spending.date} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor={`categoryId-${spending.id}`}>Category</Label>
                        <select id={`categoryId-${spending.id}`} name="categoryId" required defaultValue={spending.categoryId} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            {categories.map((cat) => (
                                <option value={cat.id} key={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor={`description-${spending.id}`}>
                            Description <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Input id={`description-${spending.id}`} name="description" placeholder="What was it for?" defaultValue={spending.description ?? ''} />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setEditing(false);
                                toast.warning('Spending Update Cancelled');
                            }}>
                            Cancel
                        </Button>
                        <Button type="submit">Update</Button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li className="flex items-center justify-between py-3 gap-4">
            <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium truncate">{spending.category.name}</span>
                {spending.description && <span className="text-sm text-muted-foreground truncate">{spending.description}</span>}
            </div>
            <div className="flex flex-col items-end shrink-0">
                <span className="font-mono font-semibold">{formatCurrency(spending.amount)}</span>
                <span className="text-xs text-muted-foreground">{new Date(spending.date).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2 shrink-0">
                <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)}>
                    <Pencil className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                </Button>

                <form
                    action={async (formData) => {
                        try {
                            await deleteSpending(formData);
                            toast.success('Spending deleted');
                        } catch {
                            toast.error('Failed to delete spending');
                        }
                    }}>
                    <input type="hidden" name="spendingId" value={spending.id} />
                    <Button type="submit" variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                    </Button>
                </form>
            </div>
        </li>
    );
}
