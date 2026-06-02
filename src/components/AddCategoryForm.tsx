'use client';

import {createCategory} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

export default function AddCategoryForm(){ 
    return(
        <form action={createCategory} className="space-y-3 max-w-sm">
            <div>
                <Label htmlFor="name">Category name</Label>
                <Input id="name" name="name" placeholder="New Category" required />
            </div>
            <Button type="submit">Create category</Button>
        </form>
    );
}