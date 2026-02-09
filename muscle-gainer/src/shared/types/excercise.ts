import { type ExcerciseSetDto } from "./excerciseSet"
export interface ExcerciseDto {
    id: string;
    date: string;
    restTimeSeconds: number;
    sets: ExcerciseSetDto[];
}