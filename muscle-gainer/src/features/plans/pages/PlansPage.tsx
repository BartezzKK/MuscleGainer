import { useEffect, useState } from 'react';
import type { Plan } from '../types';
import { planService } from '../services/planService';
import PlanCard from '../components/PlanCard';

const PlansPage = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchPlans = async () => {
        try {
            const data = await planService.getPlans();
            setPlans(data);
        } catch {
            setError('Błąd podczas pobierania planów.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setCreating(true);
        try {
            await planService.createPlan({ name: newName.trim() });
            setNewName('');
            await fetchPlans();
        } catch {
            setError('Błąd podczas tworzenia planu.');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Usunąć plan? Ta operacja jest nieodwracalna.')) return;
        try {
            await planService.deletePlan(id);
            setPlans((prev) => prev.filter((p) => p.id !== id));
        } catch {
            setError('Błąd podczas usuwania planu.');
        }
    };

    if (loading) return <div className="text-[#94a3b8]">Ładowanie planów...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Plany treningowe</h1>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {/* Create form */}
            <div className="flex gap-3 mb-8">
                <input
                    className="flex-1 bg-[#1a1a2e] border border-[#3a3a5c] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-indigo-500"
                    placeholder="Nazwa nowego planu (np. Plan A – Siłowy)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <button
                    onClick={handleCreate}
                    disabled={creating || !newName.trim()}
                    className="px-5 py-2.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold transition-colors cursor-pointer"
                >
                    {creating ? 'Tworzenie...' : 'Utwórz plan'}
                </button>
            </div>

            {/* Plan list */}
            {plans.length === 0 ? (
                <div className="text-center py-16 text-[#94a3b8]">
                    <p className="text-4xl mb-4">📋</p>
                    <p className="text-lg font-semibold text-white mb-2">Brak planów treningowych</p>
                    <p className="text-sm">Utwórz swój pierwszy plan, aby zacząć planować treningi.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlansPage;
