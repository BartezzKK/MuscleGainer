import { useState, useEffect, useRef } from 'react';
import type { AddSetRequest } from '../types';
import { workoutService } from '../services/workoutService';

interface AddSetFormProps {
    exerciseId: number;
    nextOrder: number;
    onSetAdded: () => void;
    defaultReps?: number;
    defaultWeight?: number;
}

const AddSetForm = ({ exerciseId, nextOrder, onSetAdded, defaultReps, defaultWeight }: AddSetFormProps) => {
    const [reps, setReps] = useState(defaultReps?.toString() ?? '');
    const [weight, setWeight] = useState(defaultWeight?.toString() ?? '');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update defaults when exercise changes (new slide)
    const prevExerciseId = useRef(exerciseId);
    useEffect(() => {
        if (prevExerciseId.current !== exerciseId) {
            prevExerciseId.current = exerciseId;
            setReps(defaultReps?.toString() ?? '');
            setWeight(defaultWeight?.toString() ?? '');
        }
    }, [exerciseId, defaultReps, defaultWeight]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const request: AddSetRequest = {
                reps: parseInt(reps),
                weight: parseFloat(weight),
                order: nextOrder,
            };
            await workoutService.addSet(exerciseId, request);
            // Keep values so next set is pre-filled with same reps/weight
            onSetAdded();
        } catch {
            setError('Błąd podczas dodawania serii.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border border-dashed border-indigo-700/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">+ Dodaj serię</p>
            {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
            <div className="flex gap-3 items-end">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#94a3b8]">Powtórzenia</label>
                    <input
                        type="number"
                        min="1"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        required
                        placeholder="12"
                        className="w-20 px-3 py-2 rounded-lg bg-[#0f0f1a] border border-[#3a3a5c] text-white text-center 
                                   text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#94a3b8]">Waga (kg)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                        placeholder="60"
                        className="w-24 px-3 py-2 rounded-lg bg-[#0f0f1a] border border-[#3a3a5c] text-white text-center 
                                   text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                               text-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                    {isSubmitting ? 'Dodawanie...' : '+ Dodaj serię'}
                </button>
            </div>
        </form>
    );
};

export default AddSetForm;
