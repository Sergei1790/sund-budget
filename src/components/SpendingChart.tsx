'use client';
import {Pie, PieChart, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import formatCurrency from '@/lib/format';

const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

export default function SpendingChart({data}: {data: {name: string; total: number}[]}) {
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
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--foreground)',
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
