'use client';

import {createHousehold} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from 'sonner';

export default function CreateHouseholdForm() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Create your household</h2>
            <p className="text-muted-foreground mb-6">Start tracking spending with your partner.</p>
            <form 
                action={async (formData) => {
                    try {
                        await createHousehold(formData);
                        toast.success('Household created');
                    } catch {
                        toast.error('Failed to create household');
                    }
                }}
                className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="name">Household name</Label>
                    <Input id="name" name="name" placeholder="My Family" required />
                </div>
                <Button type="submit" className="w-full">
                    Create household
                </Button>
            </form>
        </div>
    );
}