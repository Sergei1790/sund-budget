import type {Household, Category, Spending} from '@/generated/prisma/client';
import AddCategoryForm from '@/components/AddCategoryForm';
import AddSpendingForm from '@/components/AddSpendingForm';

interface Props {
    household: Household & {
        categories: Category[];
        spendings: (Spending & {category: Category})[];
    };
}

export default function Dashboard({household}: Props) {
    return (
        <div>
            <h2>{household.name}</h2>
            <ul>
                {household.categories.map((cat) => (
                    <li key={cat.id}>{cat.name}</li>
                ))}
            </ul>
            <AddSpendingForm categories={household.categories} />
            <ul>
                {household.spendings.map((spending) => (
                    <li key={spending.id}>
                        <div>{spending.amount.toString()}</div>
                        <div>{spending.category.name}</div>
                        <div>{spending.date.toLocaleDateString()}</div>
                        <div>{spending.description}</div>
                    </li>
                ))}
            </ul>
            <AddCategoryForm />
        </div>
    );
}
