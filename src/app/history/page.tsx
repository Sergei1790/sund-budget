import {redirect} from 'next/navigation';
import {format} from 'date-fns';
import formatCurrency from '@/lib/format';
import {aggregateByMonth} from '@/lib/aggregate';
import {getHousehold} from '@/lib/household';
export default async function History() {
    const household = await getHousehold();
    if (!household) redirect('/');
    const spendings = household.spendings;

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

            <div className="max-w-2xl mx-auto space-y-6">
                {months.map(({month, items, total}) => (
                    <section key={month} className="rounded-lg border border-border p-4 space-y-2">
                        <div className="flex items-center justify-between border-b border-border pb-1">
                            <h2 className="text-lg font-semibold">{format(new Date(month + '-01'), 'MMMM yyyy')}</h2>
                            <span className="font-mono font-semibold">{formatCurrency(total)}</span>
                        </div>
                        <ul className="divide-y divide-border columns-1 sm:columns-2 gap-6">
                            {items.map((s) => (
                                <li key={s.id} className="break-inside-avoid flex items-center justify-between py-2 gap-4">
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="truncate">{s.category.name}</span>
                                        {s.description && <span className="text-xs text-muted-foreground truncate">{s.description}</span>}
                                    </div>
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
