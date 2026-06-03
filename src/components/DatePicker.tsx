'use client'

import {useState} from 'react';
import {Popover, PopoverTrigger, PopoverContent} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Calendar} from '@/components/ui/calendar';
import {format} from 'date-fns';
import {CalendarIcon} from 'lucide-react';

export default function DatePicker({ name }: { name: string }){
    const [date, setDate] = useState<Date>(new Date());
    return(
        <>
            <Popover>
                <PopoverTrigger asChild>
                     <Button
                        type="button"
                        variant="outline"
                        className='w-full justify-start text-left font-normal'
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(date, 'PPPP')}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
                </PopoverContent>
            </Popover>
            <Input id={name} name={name} type="hidden" value={date ? format(date, 'yyyy-MM-dd') : ''} />
        </>
    );
}
