import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { bodyWeightService } from '../../bodyWeight/services/bodyWeightService';
import type { BodyWeightLogDTO } from '../../bodyWeight/types';

const BodyWeightChart = () => {
    const [data, setData] = useState<BodyWeightLogDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bodyWeightService.getHistory()
            .then((entries) => setData(entries.filter((e) => e.weightKg > 0)))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-[#94a3b8] text-sm p-4">Ładowanie wykresu masy...</div>;
    if (data.length === 0) return null;

    const chartData = data.map((e) => ({
        date: new Date(e.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }),
        'Masa (kg)': e.weightKg,
    }));

    const weights = data.map((e) => e.weightKg);
    const minWeight = Math.floor(Math.min(...weights) - 1);
    const maxWeight = Math.ceil(Math.max(...weights) + 1);

    return (
        <div className="bg-[#1a1a2e] border border-[#3a3a5c] rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">Masa ciała</h3>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a5c" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[minWeight, maxWeight]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #3a3a5c', borderRadius: 8 }}
                        labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Masa (kg)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BodyWeightChart;
