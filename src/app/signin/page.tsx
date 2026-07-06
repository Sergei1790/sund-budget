import {signIn} from '@/auth';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';

export default async function SignInPage({searchParams}: {searchParams: Promise<{callbackUrl?: string}>}) {
    const {callbackUrl} = await searchParams;
    return (
        <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Sund Budget</CardTitle>
                    <CardDescription>Sign in to continue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <form action={async () => { 'use server'; await signIn('google', {redirectTo: callbackUrl ?? '/'}); }}>
                        <Button type="submit" className="w-full">Sign in with Google</Button>
                    </form>
                    <form action={async () => { 'use server'; await signIn('github', {redirectTo: callbackUrl ?? '/'}); }}>
                        <Button type="submit" className="w-full">Sign in with GitHub</Button>
                    </form>
                    <form action={async () => { 'use server'; await signIn('demo', { redirectTo: '/' }); }}>
                        <Button type="submit" variant="secondary" className="w-full">Try the demo</Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
