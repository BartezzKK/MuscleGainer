import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { statsService } from '../services/statsService';
import type { ExerciseProgressDTO } from '../types';

interface Props {
    exerciseName: string;
}

const ProgressChart = ({ exerciseName }: Props) => {
    const [data, setData] = useState<ExerciseProgressDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!exerciseName) return;
        setLoading(true);
        setError('');
        statsService.getExerciseProgress(exerciseName)
            .then(setData)
            .catch(() => setError('Błąd podczas pobierania progresu.'))
            .finally(() => setLoading(false));
    }, [exerciseName]);

    if (loading) return <div className="text-[#94a3b8] text-sm p-4">Ładowanie wykresu...</div>;
    if (error) return <div className="text-[#f87171] text-sm p-4">{error}</div>;
    if (!data || data.entries.length === 0)
        return <div className="text-[#94a3b8] text-sm p-4">Brak danych dla tego ćwiczenia.</div>;

    const chartData = data.entries.map((e) => ({
        date: new Date(e.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }),
        'Max waga (kg)': e.maxWeight,
        'Max powtórzenia': e.maxReps,
        'Objętość (kg)': e.volume,
    }));

    return (
        <div className="bg-[#1a1a2e] border border-[#3a3a5c] rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">Progres: {exerciseName}</h3>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a5c" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #3a3a5c', borderRadius: 8 }}
                        labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                    <Line type="monotone" dataKey="Max waga (kg)" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Max powtórzenia" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgressChart;
