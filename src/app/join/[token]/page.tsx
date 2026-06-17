import {auth} from '@/auth';
import {prisma} from '@/lib/prisma';
import {joinHousehold} from '@/lib/actions';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {redirect} from 'next/navigation';

export default async function JoinHousehold({params}: {params: Promise<{token: string}>}) {
    const {token} = await params;
    const household = await prisma.household.findUnique({where: {inviteToken: token}});
    const session = await auth();
    if (!session?.user?.email) redirect(`/signin?callbackUrl=/join/${token}`);

    if (!household) {
        return <main>No Household</main>;
    }
    return (
        <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Sund Budget</CardTitle>
                    <CardDescription>You are invited to join {household.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <form action={joinHousehold}>
                        <input type="hidden" name="inviteToken" value={token} />
                        <Button type="submit" className="w-full">
                            Join household
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
