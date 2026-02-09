import { type ExcerciseDto } from "./excercise";

export interface TrainingDayDto {
    id: string;
    date: string;
    excercises: ExcerciseDto[];
}