import { useState } from 'react';
import type { CreateWorkoutRequest } from '../types';
import { workoutService } from '../services/workoutService';

interface CreateWorkoutFormProps {
    onWorkoutCreated: () => void;
}

const CreateWorkoutForm = ({ onWorkoutCreated }: CreateWorkoutFormProps) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const request: CreateWorkoutRequest = {
                name,
                date: new Date(date).toISOString(),
            };
            await workoutService.createWorkout(request);
            setName('');
            setDate(new Date().toISOString().split('T')[0]);
            onWorkoutCreated();
        } catch {
            setError('Błąd podczas tworzenia treningu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
            <h3>Nowy trening</h3>
            {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Nazwa</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="np. Trening A - Klatka"
                        style={{ padding: '0.5em', borderRadius: '6px', border: '1px solid #444', background: '#1a1a1a', color: 'white' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Data</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        style={{ padding: '0.5em', borderRadius: '6px', border: '1px solid #444', background: '#1a1a1a', color: 'white' }}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} style={{ padding: '0.5em 1.2em' }}>
                    {isSubmitting ? 'Tworzenie...' : 'Dodaj trening'}
                </button>
            </div>
        </form>
    );
};

export default CreateWorkoutForm;
