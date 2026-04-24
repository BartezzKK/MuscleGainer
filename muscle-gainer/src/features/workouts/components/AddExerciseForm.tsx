import { useState } from 'react';
import type { AddExerciseRequest } from '../types';
import { workoutService } from '../services/workoutService';

interface AddExerciseFormProps {
    workoutId: number;
    nextOrder: number;
    onExerciseAdded: () => void;
}

const AddExerciseForm = ({ workoutId, nextOrder, onExerciseAdded }: AddExerciseFormProps) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const request: AddExerciseRequest = {
                name,
                order: nextOrder,
            };
            await workoutService.addExercise(workoutId, request);
            setName('');
            onExerciseAdded();
        } catch {
            setError('Błąd podczas dodawania ćwiczenia.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="flex gap-3 items-end">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-[#94a3b8]">Nazwa ćwiczenia</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="np. Wyciskanie sztangi"
                        className="px-4 py-2.5 rounded-lg bg-[#0f0f1a] border border-[#3a3a5c] text-white placeholder-[#94a3b8] 
                                   text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                               text-sm transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                    {isSubmitting ? 'Dodawanie...' : 'Dodaj'}
                </button>
            </div>
        </form>
    );
};

export default AddExerciseForm;
