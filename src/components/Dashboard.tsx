import type {Household, Category, Spending} from '@/generated/prisma/client';
import AddCategoryForm from '@/components/AddCategoryForm';
import AddSpendingForm from '@/components/AddSpendingForm';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';

interface Props {
    household: Household & {
        categories: Category[];
        spendings: (Spending & {category: Category})[];
    };
}

export default function Dashboard({household}: Props) {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <header>
                <h2 className="text-3xl font-bold">{household.name}</h2>
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
                                <li key={spending.id} className="flex items-center justify-between py-3 gap-4">
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium truncate">{spending.category.name}</span>
                                        {spending.description && (
                                            <span className="text-sm text-muted-foreground truncate">
                                                {spending.description}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end shrink-0">
                                        <span className="font-mono font-semibold">{spending.amount.toString()}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {spending.date.toLocaleDateString()}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {household.categories.map((cat) => (
                            <span
                                key={cat.id}
                                className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                    <AddCategoryForm />
                </CardContent>
            </Card>
        </div>
    );
}