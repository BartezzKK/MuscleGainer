export interface ExerciseSetDTO {
    id: number;
    reps: number;
    weight: number;
    order: number;
}

export interface ExerciseDTO {
    id: number;
    name: string;
    order: number;
    sets: ExerciseSetDTO[];
    previousSets: ExerciseSetDTO[];
}

export interface WorkoutDTO {
    id: number;
    name: string;
    date: string;
    createdAt: string;
    exercises: ExerciseDTO[];
    planDayId?: number | null;
    planName?: string | null;
}

export interface CreateWorkoutRequest {
    name: string;
    date: string;
}

export interface AddExerciseRequest {
    name: string;
    order: number;
}

export interface AddSetRequest {
    reps: number;
    weight: number;
    order: number;
}
