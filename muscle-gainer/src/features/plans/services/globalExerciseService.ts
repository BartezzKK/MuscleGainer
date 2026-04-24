import { api } from '../../../api/axios';
import type { MuscleGroup, ExerciseType, Equipment, Difficulty } from '../types';

export interface GlobalExercise {
    id: number;
    name: string;
    muscleGroup: MuscleGroup | null;
    exerciseType: ExerciseType | null;
    equipment: Equipment | null;
    difficulty: Difficulty | null;
}

interface GlobalExerciseFilters {
    muscleGroup?: MuscleGroup;
    exerciseType?: ExerciseType;
    equipment?: Equipment;
    difficulty?: Difficulty;
}

export const globalExerciseService = {
    getExercises: async (filters: GlobalExerciseFilters = {}): Promise<GlobalExercise[]> => {
        const params = new URLSearchParams();
        if (filters.muscleGroup !== undefined) params.append('muscleGroup', String(filters.muscleGroup));
        if (filters.exerciseType !== undefined) params.append('exerciseType', String(filters.exerciseType));
        if (filters.equipment !== undefined) params.append('equipment', String(filters.equipment));
        if (filters.difficulty !== undefined) params.append('difficulty', String(filters.difficulty));

        const res = await api.get<GlobalExercise[]>(`/exercises?${params.toString()}`);
        return res.data;
    },
};
