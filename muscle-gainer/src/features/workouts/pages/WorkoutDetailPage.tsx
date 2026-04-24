import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { WorkoutDTO } from '../types';
import { workoutService } from '../services/workoutService';
import WorkoutActiveView from '../components/WorkoutActiveView';

const WorkoutDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState<WorkoutDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWorkout = async () => {
        if (!id) return;
        try {
            const data = await workoutService.getWorkout(parseInt(id));
            setWorkout(data);
        } catch {
            setError('Nie znaleziono treningu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkout();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-[#94a3b8]">
                Ładowanie treningu...
            </div>
        );
    }

    if (error || !workout) {
        return (
            <div className="px-4 py-3 rounded-lg bg-[#3b1414] text-red-400 text-sm max-w-md">
                {error || 'Nie znaleziono treningu.'}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/workouts')}
                className="self-start text-[#94a3b8] hover:text-white text-sm cursor-pointer transition-colors"
            >
                ← Powrót do listy
            </button>
            <WorkoutActiveView
                workout={workout}
                onExerciseAdded={fetchWorkout}
                onSetAdded={fetchWorkout}
            />
        </div>
    );
};

export default WorkoutDetailPage;
