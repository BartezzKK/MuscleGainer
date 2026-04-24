import type { WorkoutDTO } from "../../workouts/types";

export interface RecentWorkoutDTO {
  id: number;
  name: string;
  date: string;
  exerciseCount: number;
  setCount: number;
  volume: number;
}

export interface DashboardDTO {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalVolume: number;
  lastWorkout: WorkoutDTO | null;
  recentWorkouts: RecentWorkoutDTO[];
}

export interface ProgressEntryDTO {
  date: string;
  maxWeight: number;
  maxReps: number;
  volume: number;
}

export interface ExerciseProgressDTO {
  exerciseName: string;
  entries: ProgressEntryDTO[];
}
