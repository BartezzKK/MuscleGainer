import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { WeeklyLog, Plan } from '../types';
import { planService } from '../services/planService';
import WeeklyLogView from '../components/WeeklyLogView';

const WeeklyLogPage = () => {
    const { id } = useParams<{ id: string }>();
    const planId = Number(id);
    const navigate = useNavigate();

    const [plan, setPlan] = useState<Plan | null>(null);
    const [log, setLog] = useState<WeeklyLog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [planData, logData] = await Promise.all([
                planService.getPlans().then((plans) => plans.find((p) => p.id === planId) ?? null),
                planService.getCurrentWeekLog(planId),
            ]);
            setPlan(planData);
            setLog(logData);
        } catch {
            setError('Błąd podczas pobierania danych treningu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [planId]);

    if (loading) return <div className="text-[#94a3b8]">Ładowanie planu tygodnia...</div>;
    if (error) return <div className="text-red-400">{error}</div>;
    if (!log) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={() => navigate(`/plans/${planId}`)}
                    className="text-[#94a3b8] hover:text-white text-sm cursor-pointer"
                >
                    ← {plan?.name ?? 'Plan'}
                </button>
            </div>

            <h1 className="text-2xl font-bold text-white mb-6">Ten tydzień</h1>

            <WeeklyLogView log={log} onChanged={fetchData} />
        </div>
    );
};

export default WeeklyLogPage;
