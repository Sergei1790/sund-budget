'use client';

import {useState} from 'react';
import type {Category, Spending} from '@/generated/prisma/client';
import SpendingChart from './SpendingChart';
import formatCurrency from '@/lib/format';
import {Button} from '@/components/ui/button';
import {X} from 'lucide-react';

interface Props {
    chartData: {name: string; total: number}[];
    spendings: (Omit<Spending, 'amount'> & {amount: number; category: Category})[];
}

export default function SpendingByCategory({chartData, spendings}: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    function clearSelection() {
        setSelectedCategory(null);
        setSelectedColor(null);
    }
    function handleSelect(name: string, color: string) {
        if (selectedCategory === name) {
            clearSelection()
        } else {
            setSelectedCategory(name);
            setSelectedColor(color);
        }
    }

    const categorySpendings = spendings.filter((spending) => spending.category.name === selectedCategory);

    return (
        <div className="space-y-4">
            <SpendingChart data={chartData} onSelectCategory={handleSelect} />

            {selectedCategory === null ? (
                <p className="text-sm text-muted-foreground text-center">Click a category to see its spendings.</p>
            ) : categorySpendings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No spendings in {selectedCategory} this period.</p>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold" style={{color: selectedColor ?? undefined}}>
                            {selectedCategory}
                        </h3>
                        <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
                            <X className="h-4 w-4" />
                            Hide
                        </Button>
                    </div>
                    <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                        {categorySpendings.map((spending) => (
                            <li key={spending.id} className="flex items-center justify-between gap-4 border-b border-border py-3">
                                <span className="min-w-0 flex-1 truncate text-sm">{spending.description || <span className="text-muted-foreground">No description</span>}</span>
                                <div className="flex shrink-0 flex-col items-end">
                                    <span className="font-mono font-semibold">{formatCurrency(spending.amount)}</span>
                                    <span className="text-xs text-muted-foreground">{new Date(spending.date).toLocaleDateString()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
