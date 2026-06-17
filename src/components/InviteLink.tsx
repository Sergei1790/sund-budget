'use client';
import {useState} from 'react';
import {Link2, Check} from 'lucide-react';
import {Button} from '@/components/ui/button';

export default function InviteLink({inviteToken}: {inviteToken: string}) {
    const [copying, setCopying] = useState(false);

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => {
                const url = `${window.location.origin}/join/${inviteToken}`;
                navigator.clipboard.writeText(url);
                setCopying(true);
                setTimeout(() => setCopying(false), 2000);
            }}
        >
            {copying ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{copying ? 'Copied' : 'Copy invite link'}</span>
        </Button>
    );
}