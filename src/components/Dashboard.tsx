interface Props {
    household: {
        name: string;
        categories: {id: number,name: string, icon?: string,}[]
    }
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