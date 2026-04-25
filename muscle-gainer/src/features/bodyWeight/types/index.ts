export interface BodyWeightLogDTO {
    id: number;
    weightKg: number;
    date: string;
    workoutId?: number | null;
}

export interface LogBodyWeightRequest {
    weightKg: number;
    date: string;
    workoutId?: number | null;
}
