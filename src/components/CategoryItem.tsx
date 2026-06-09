'use client';
import type {Category} from '@/generated/prisma/client';
import {useState} from 'react';
import {updateCategory, deleteCategory} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Pencil} from 'lucide-react';
import {Input} from '@/components/ui/input';
interface Props {
    category: Category;
}

export default function CategoryItem({category}: Props) {
    const [editing, setEditing] = useState(false);
    if (editing) {
        return (
            <div className="inline-flex items-center gap-2">
                <form action={async (formData) => {
                    await updateCategory(formData);
                    setEditing(false);
                }} className="inline-flex items-center gap-2">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <Input name="name" defaultValue={category.name} required autoFocus className="h-7 w-32 text-sm" />
                    <Button type="submit" size="sm">Update</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)}>
                        Cancel
                    </Button>
                </form>
                <form action={deleteCategory} onSubmit={(e) => {
                    if (!confirm('Delete this category and all its spendings?')) e.preventDefault();
                }}>
                    <input type="hidden" name="categoryId" value={category.id} />
                    <Button type="submit" variant="destructive" size="sm">Delete</Button>
                </form>
            </div>
        );
    }

    return (
        <div className="inline-flex items-center gap-1">
            <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{category.name}</span>
            <button type="button" onClick={() => setEditing(true)} aria-label={`Edit ${category.name}`} className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors">
                <Pencil size={14} />
            </button>
        </div>
    );
}
