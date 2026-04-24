import { api } from "../../../api/axios";
import type {
    WorkoutDTO,
    CreateWorkoutRequest,
    AddExerciseRequest,
    AddSetRequest,
    ExerciseDTO,
} from "../types";

export const workoutService = {
    getWorkouts: async (): Promise<WorkoutDTO[]> => {
        const response = await api.get<WorkoutDTO[]>("/workouts");
        return response.data;
    },

    getWorkout: async (id: number): Promise<WorkoutDTO> => {
        const response = await api.get<WorkoutDTO>(`/workouts/${id}`);
        return response.data;
    },

    createWorkout: async (data: CreateWorkoutRequest): Promise<WorkoutDTO> => {
        const response = await api.post<WorkoutDTO>("/workouts", data);
        return response.data;
    },

    addExercise: async (workoutId: number, data: AddExerciseRequest): Promise<WorkoutDTO> => {
        const response = await api.post<WorkoutDTO>(`/workouts/${workoutId}/exercises`, data);
        return response.data;
    },

    addSet: async (exerciseId: number, data: AddSetRequest): Promise<ExerciseDTO> => {
        const response = await api.post<ExerciseDTO>(`/workouts/exercises/${exerciseId}/sets`, data);
        return response.data;
    },

    deleteWorkout: async (id: number): Promise<void> => {
        await api.delete(`/workouts/${id}`);
    },

    createFromPlanDay: async (planDayId: number): Promise<WorkoutDTO> => {
        const response = await api.post<WorkoutDTO>(`/workouts/from-plan-day/${planDayId}`);
        return response.data;
    },
};
