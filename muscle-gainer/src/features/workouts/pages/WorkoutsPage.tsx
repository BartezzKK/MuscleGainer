import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkoutDTO } from '../types';
import { workoutService } from '../services/workoutService';
import WorkoutList from '../components/WorkoutList';
import CreateWorkoutForm from '../components/CreateWorkoutForm';

const WorkoutsPage = () => {
    const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchWorkouts = async () => {
        try {
            const data = await workoutService.getWorkouts();
            setWorkouts(data);
        } catch {
            setError('Błąd podczas pobierania treningów.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await workoutService.deleteWorkout(id);
            setWorkouts((prev) => prev.filter((w) => w.id !== id));
        } catch {
            setError('Błąd podczas usuwania treningu.');
        }
    };

    if (loading) return <div>Ładowanie treningów...</div>;

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
            <h1>Moje treningi</h1>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            <CreateWorkoutForm onWorkoutCreated={fetchWorkouts} />
            <WorkoutList
                workouts={workouts}
                onSelect={(id) => navigate(`/workouts/${id}`)}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default WorkoutsPage;
