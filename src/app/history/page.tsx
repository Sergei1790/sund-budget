import {prisma} from '@/lib/prisma';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';
import {format} from 'date-fns';
import formatCurrency from '@/lib/format';
import {aggregateByMonth} from '@/lib/aggregate';
export default async function History() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const dbUser = await prisma.user.findUnique({
        where: {email: session.user.email},
        include: {
            households: {
                include: {
                    household: {
                        include: {
                            spendings: {
                                include: {category: true},
                                orderBy: {date: 'desc'},
                            },
                        },
                    },
                },
            },
        },
    });
    if (!dbUser) {
        return <p>User not found</p>;
    }
    if (!dbUser.households[0]?.household) redirect(`/`);

    const spendings = dbUser.households[0].household.spendings;

    const months = aggregateByMonth(spendings);
   
    const grandTotal = spendings.reduce((acc, s) => acc + s.amount.toNumber(), 0);
    
    return (
        <main className="pt-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">History</h1>
                <div className="text-right">
                    <span className="text-sm text-muted-foreground block">Total spent</span>
                    <span className="text-2xl font-mono font-bold">{formatCurrency(grandTotal)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {months.map(({month, items, total}) => (
                    <section key={month} className="rounded-lg border border-border p-4 space-y-2">
                        <div className="flex items-center justify-between border-b border-border pb-1">
                            <h2 className="text-lg font-semibold">{format(new Date(month + '-01'), 'MMMM yyyy')}</h2>
                            <span className="font-mono font-semibold">{formatCurrency(total)}</span>
                        </div>
                        <ul className="divide-y divide-border">
                            {items.map((s) => (
                                <li key={s.id} className="flex items-center justify-between py-2 gap-4">
                                    <span className="flex-1 truncate">{s.category.name}</span>
                                    <span className="font-mono">{formatCurrency(s.amount.toNumber())}</span>
                                    <span className="text-xs text-muted-foreground w-20 text-right">{new Date(s.date).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </main>
    );
}
