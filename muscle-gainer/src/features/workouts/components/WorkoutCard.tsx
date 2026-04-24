import type { WorkoutDTO } from '../types';

interface WorkoutCardProps {
    workout: WorkoutDTO;
    onClick: () => void;
    onDelete: () => void;
}

const WorkoutCard = ({ workout, onClick, onDelete }: WorkoutCardProps) => {
    const formattedDate = new Date(workout.date).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div
            style={{
                border: '1px solid #444',
                borderRadius: '8px',
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
            onClick={onClick}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#646cff')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#444')}
        >
            <div>
                <h3 style={{ margin: '0 0 0.25rem 0' }}>{workout.name}</h3>
                <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>{formattedDate}</p>
                <p style={{ margin: '0.25rem 0 0 0', color: '#888', fontSize: '0.85rem' }}>
                    {workout.exercises.length} ćwiczeń
                </p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                style={{
                    background: '#cc3333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4em 0.8em',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                }}
            >
                Usuń
            </button>
        </div>
    );
};

export default WorkoutCard;
