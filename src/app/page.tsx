import CreateHouseholdForm from '@/components/CreateHouseholdForm';
import Dashboard from '@/components/Dashboard';
import {getHousehold} from '@/lib/household';

export default async function Home() {
    const household = await getHousehold();

    return (
        <main className="pt-4 sm:p-6">
            {household ? (
                <div>
                    <Dashboard household={household} />
                </div>
            ) : (
                <CreateHouseholdForm />
            )}
        </main>
    );
}
