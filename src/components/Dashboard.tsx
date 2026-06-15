import type {Household, Category, Spending} from '@/generated/prisma/client';
import AddCategoryForm from '@/components/AddCategoryForm';
import AddSpendingForm from '@/components/AddSpendingForm';
import SpendingRow from '@/components/SpendingRow';
import CategoryItem from '@/components/CategoryItem';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import formatCurrency from '@/lib/format';
import {startOfMonth, startOfWeek, isAfter} from 'date-fns';
import SpendingChart from './SpendingChart';
interface Props {
    household: Household & {
        categories: Category[];
        spendings: (Spending & {category: Category})[];
    };
}

export default function Dashboard({household}: Props) {
    const weekStart = startOfWeek(new Date(), {weekStartsOn: 1});
    const weekSpendings = household.spendings.filter((s) => isAfter(s.date, weekStart));
    const weekTotal = weekSpendings.reduce((acc, s) => acc + s.amount.toNumber(), 0);

    const monthStart = startOfMonth(new Date());
    const monthSpendings = household.spendings.filter((s) => isAfter(s.date, monthStart));
    const monthTotal = monthSpendings.reduce((acc, s) => acc + s.amount.toNumber(), 0);

    const totals = new Map<string, number>();

    for (const s of monthSpendings) {
        const current = totals.get(s.category.name) ?? 0;   
        totals.set(s.category.name, current + Number(s.amount));
    }
    const chartData = Array.from(totals, ([name, total]) => ({name, total}));


    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <header className="space-y-4">
                <h2 className="text-3xl font-bold">{household.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">This week</span>
                        <span className="text-3xl font-bold">{formatCurrency(weekTotal)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">This month</span>
                        <span className="text-3xl font-bold">{formatCurrency(monthTotal)}</span>
                    </div>
                </div>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Add spending</CardTitle>
                </CardHeader>
                <CardContent>
                    <AddSpendingForm categories={household.categories} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent spending</CardTitle>
                </CardHeader>
                <CardContent>
                    {household.spendings.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No spending logged yet.</p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {household.spendings.map((spending) => (
                                <SpendingRow key={spending.id} spending={{...spending, amount: spending.amount.toNumber()}} categories={household.categories} />
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Spending by category (this month)</CardTitle>
                </CardHeader>
                <CardContent>
                    {chartData.length > 0 ? <SpendingChart data={chartData} /> : <p>No data yet</p>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {household.categories.map((cat) => (
                            <CategoryItem key={cat.id} category={cat} />
                        ))}
                    </div>
                    <AddCategoryForm />
                </CardContent>
            </Card>

        </div>
    );
}
