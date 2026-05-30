import type {Household, Category} from '@/generated/prisma/client';
interface Props {
  household: Household & {categories: Category[]};
}

export default function Dashboard({household}: Props){ 
    return(
        <div>
            <h2>{household.name}</h2>
            <ul>
                {household.categories.map((cat) => (
                    <li key={cat.id}>
                        {cat.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}