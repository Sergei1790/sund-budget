import CreateHouseholdForm from '@/components/CreateHouseholdForm';
import {prisma} from '@/lib/prisma';
import {auth} from '@/auth';

export default async function Home() {
    const session = await auth();
    if (!session?.user?.email) return null;
    
    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { households: true }
    });
    
    if (!dbUser) {
        return <p>User not found</p>;
    }
    
    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sund Budget</h1>
            {dbUser.households.length > 0 
                ? <p>Dashboard</p>
                : <CreateHouseholdForm />
            }
        </main>
    );
}

