import { signIn } from '@/auth';

export default function SignInPage() {
    return(
        <main className="min-h-screen flex items-center justify-center">
            <div className="bg-card border border-white/10 rounded-2xl p-8 w-full max-w-sm space-y-4">
                <h1
                    className="text-2xl font-bold text-center bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-highlight))' }}
                >Reading Tracker</h1>
                <p className="text-muted text-center text-sm">Sign in to continue</p>

                <form action={async () => { 'use server'; await signIn('github', { redirectTo: '/' }); }}>
                    <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium">
                        Sign in with GitHub
                    </button>
                </form>

                <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/' }); }}>
                    <button type="submit" className="w-full bg-card border border-white/10 hover:border-primary/40 text-foreground py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                        Sign in with Google
                    </button>
                </form>
            </div>
        </main>
    );
}