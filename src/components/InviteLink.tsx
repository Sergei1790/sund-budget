'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

export default function InviteLink({inviteToken}: {inviteToken: string}) {
    const [copying, setCopying] = useState(false);

    return (
        <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={() => {
                const url = `${window.location.origin}/join/${inviteToken}`;
                navigator.clipboard.writeText(url);
                setCopying(true);
                setTimeout(() => setCopying(false), 2000)
            }}>
            {copying ? 'Copied' : 'Copy invite link'} 
        </Button>
    );
}
