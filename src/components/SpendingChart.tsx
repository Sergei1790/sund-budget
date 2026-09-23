'use client';
import {Pie, PieChart, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import formatCurrency from '@/lib/format';

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)', 'var(--chart-7)', 'var(--chart-8)', 'var(--chart-9)', 'var(--chart-10)'];

export default function SpendingChart({data, onSelectCategory}: {data: {name: string; total: number}[]; onSelectCategory: (name: string, color: string) => void}) {
    const coloredData = data.map((d, i) => ({...d, fill: COLORS[i % COLORS.length]}));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={coloredData}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    cornerRadius={6}
                    stroke="transparent"
                    label={({value}) => formatCurrency(value)}
                    onClick={(entry) => {
                        if (entry.name) onSelectCategory(entry.name, entry.fill ?? '');
                    }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--foreground)',
                    }}
                />
                <Legend
                    onClick={(entry) => {
                        if (entry.value) onSelectCategory(String(entry.value), entry.color ?? '');
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
