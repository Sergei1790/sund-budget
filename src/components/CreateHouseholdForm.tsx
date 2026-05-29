'use client';

import {createHousehold} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

export default function CreateHouseholdForm(){ 
    return(
        <form action={createHousehold} className="space-y-3 max-w-sm">
            <div>
                <Label htmlFor="name">Household name</Label>
                <Input id="name" name="name" placeholder="My Family" required />
            </div>
            <Button type="submit">Create household</Button>
        </form>
    );
}