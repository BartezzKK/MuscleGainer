import { useState } from 'react';
import type { WorkoutDTO } from '../types';
import AddExerciseForm from './AddExerciseForm';
import AddSetForm from './AddSetForm';

interface WorkoutDetailProps {
    workout: WorkoutDTO;
    onExerciseAdded: () => void;
    onSetAdded: () => void;
}

const WorkoutDetail = ({ workout, onExerciseAdded, onSetAdded }: WorkoutDetailProps) => {
    const [expandedExerciseId, setExpandedExerciseId] = useState<number | null>(null);

    const formattedDate = new Date(workout.date).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div>
            <h2 style={{ marginBottom: '0.25rem' }}>{workout.name}</h2>
            <p style={{ color: '#aaa', marginTop: 0 }}>{formattedDate}</p>

            <h3>Ćwiczenia</h3>
            {workout.exercises.length === 0 ? (
                <p style={{ color: '#888' }}>Brak ćwiczeń. Dodaj pierwsze ćwiczenie poniżej.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {workout.exercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            style={{
                                border: '1px solid #444',
                                borderRadius: '8px',
                                padding: '1rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    setExpandedExerciseId(
                                        expandedExerciseId === exercise.id ? null : exercise.id
                                    )
                                }
                            >
                                <h4 style={{ margin: 0 }}>
                                    {exercise.order}. {exercise.name}
                                </h4>
                                <span style={{ color: '#888', fontSize: '0.85rem' }}>
                                    {exercise.sets.length} serii {expandedExerciseId === exercise.id ? '▲' : '▼'}
                                </span>
                            </div>

                            {expandedExerciseId === exercise.id && (
                                <div style={{ marginTop: '0.75rem' }}>
                                    {exercise.sets.length > 0 ? (
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid #555', textAlign: 'left' }}>
                                                    <th style={{ padding: '0.4rem' }}>#</th>
                                                    <th style={{ padding: '0.4rem' }}>Powtórzenia</th>
                                                    <th style={{ padding: '0.4rem' }}>Waga (kg)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {exercise.sets.map((set) => (
                                                    <tr key={set.id} style={{ borderBottom: '1px solid #333' }}>
                                                        <td style={{ padding: '0.4rem' }}>{set.order}</td>
                                                        <td style={{ padding: '0.4rem' }}>{set.reps}</td>
                                                        <td style={{ padding: '0.4rem' }}>{set.weight}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p style={{ color: '#888', fontSize: '0.85rem' }}>Brak serii.</p>
                                    )}

                                    <AddSetForm
                                        exerciseId={exercise.id}
                                        nextOrder={exercise.sets.length + 1}
                                        onSetAdded={onSetAdded}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '1.5rem' }}>
                <AddExerciseForm
                    workoutId={workout.id}
                    nextOrder={workout.exercises.length + 1}
                    onExerciseAdded={onExerciseAdded}
                />
            </div>
        </div>
    );
};

export default WorkoutDetail;
