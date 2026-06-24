'use client';

import {createCategory} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {toast} from 'sonner';
export default function AddCategoryForm() {
    return (
        <form 
            action={async (formData) => {
                try {
                    await createCategory(formData);
                    toast.success('Category added');
                } catch {
                    toast.error('Failed to add category');
                }
            }} className="space-y-3">
            <div className="flex gap-2">
                <Input id="name" name="name" placeholder="New category name" required />
                <Button type="submit">Add</Button>
            </div>
        </form>
    );
}