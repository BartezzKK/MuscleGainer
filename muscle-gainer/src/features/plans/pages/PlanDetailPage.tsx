import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PlanDetails } from '../types';
import { planService } from '../services/planService';
import ExerciseList from '../components/ExerciseList';
import WeekGrid from '../components/WeekGrid';

const PlanDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const planId = Number(id);
    const navigate = useNavigate();

    const [plan, setPlan] = useState<PlanDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editName, setEditName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchPlan = async () => {
        try {
            const data = await planService.getPlanDetails(planId);
            setPlan(data);
            setEditName(data.name);
        } catch {
            setError('Błąd podczas pobierania planu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlan();
    }, [planId]);

    const handleSaveName = async () => {
        if (!plan || !editName.trim()) return;
        setSaving(true);
        try {
            await planService.updatePlan(planId, { name: editName.trim(), isActive: plan.isActive });
            setEditMode(false);
            await fetchPlan();
        } catch {
            setError('Błąd podczas zapisywania nazwy.');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async () => {
        if (!plan) return;
        try {
            await planService.updatePlan(planId, { name: plan.name, isActive: !plan.isActive });
            await fetchPlan();
        } catch {
            setError('Błąd podczas aktualizacji planu.');
        }
    };

    if (loading) return <div className="text-[#94a3b8]">Ładowanie planu...</div>;
    if (!plan) return <div className="text-red-400">{error || 'Plan nie znaleziony.'}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <button
                    onClick={() => navigate('/plans')}
                    className="text-[#94a3b8] hover:text-white text-sm cursor-pointer"
                >
                    ← Plany
                </button>
            </div>

            <div className="flex items-center justify-between mb-6 mt-2">
                <div className="flex items-center gap-3">
                    {editMode ? (
                        <>
                            <input
                                className="bg-[#1a1a2e] border border-indigo-500 rounded-lg px-3 py-1.5 text-lg font-bold text-white focus:outline-none"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                autoFocus
                            />
                            <button onClick={handleSaveName} disabled={saving} className="text-green-400 hover:text-green-300 text-sm cursor-pointer">Zapisz</button>
                            <button onClick={() => setEditMode(false)} className="text-[#94a3b8] hover:text-white text-sm cursor-pointer">Anuluj</button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
                            <button onClick={() => setEditMode(true)} className="text-[#94a3b8] hover:text-white text-sm cursor-pointer">✏️</button>
                            <button
                                onClick={handleToggleActive}
                                className={`text-xs px-2 py-0.5 rounded-full cursor-pointer transition-colors ${plan.isActive ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-[#2a2a3e] text-[#94a3b8] hover:bg-[#3a3a5c]'}`}
                            >
                                {plan.isActive ? 'aktywny' : 'nieaktywny'}
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => navigate(`/plans/${planId}/week`)}
                    className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors cursor-pointer"
                >
                    📅 Ten tydzień
                </button>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <div className="flex flex-col gap-8">
                {/* Exercise list */}
                <div className="border border-[#3a3a5c] rounded-xl p-5">
                    <ExerciseList planId={planId} exercises={plan.exercises} onChanged={fetchPlan} />
                </div>

                {/* Week grid */}
                <div className="border border-[#3a3a5c] rounded-xl p-5">
                    <WeekGrid planId={planId} days={plan.days} allExercises={plan.exercises} onChanged={fetchPlan} />
                </div>
            </div>
        </div>
    );
};

export default PlanDetailPage;
