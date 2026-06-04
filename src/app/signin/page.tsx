import {signIn} from '@/auth';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';

export default function SignInPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Sund Budget</CardTitle>
                    <CardDescription>Sign in to continue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <form action={async () => { 'use server'; await signIn('google', {redirectTo: '/'}); }}>
                        <Button type="submit" className="w-full">Sign in with Google</Button>
                    </form>
                    <form action={async () => { 'use server'; await signIn('github', {redirectTo: '/'}); }}>
                        <Button type="submit" className="w-full">Sign in with GitHub</Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
