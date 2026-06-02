import CreateHouseholdForm from '@/components/CreateHouseholdForm';
import AddCategoryForm from '@/components/AddCategoryForm';
import Dashboard from '@/components/Dashboard';
import {prisma} from '@/lib/prisma';
import {auth} from '@/auth';

export default async function Home() {
    const session = await auth();
    if (!session?.user?.email) return null;
    
    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { 
            households: {
                include:{
                    household:{
                        include:{
                            categories: true
                        }
                    }
                }
            }
        }
    });
    if (!dbUser) {
        return <p>User not found</p>;
    }
    const household = dbUser.households[0]?.household;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sund Budget</h1>
            {household
                ? <div>
                    <Dashboard household={household} />
                    <AddCategoryForm />
                </div>
                : <CreateHouseholdForm />
            }
        </main>
    );
}

