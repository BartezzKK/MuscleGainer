import type { WorkoutDTO } from '../types';
import WorkoutCard from './WorkoutCard';

interface WorkoutListProps {
    workouts: WorkoutDTO[];
    onSelect: (id: number) => void;
    onDelete: (id: number) => void;
}

const WorkoutList = ({ workouts, onSelect, onDelete }: WorkoutListProps) => {
    if (workouts.length === 0) {
        return <p style={{ color: '#aaa' }}>Brak treningów. Dodaj swój pierwszy trening!</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {workouts.map((workout) => (
                <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onClick={() => onSelect(workout.id)}
                    onDelete={() => onDelete(workout.id)}
                />
            ))}
        </div>
    );
};

export default WorkoutList;
