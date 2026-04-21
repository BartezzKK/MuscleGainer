using Domain.Enums;

namespace Domain.Plans.DTO
{
    public record CreatePlanDto(string Name);
    public record UpdatePlanDto(string Name, bool IsActive);
    public record AddExerciseDto(string Name, int DefaultSets, MuscleGroup? MuscleGroup, ExerciseType? ExerciseType, Equipment? Equipment, Difficulty? Difficulty);
    public record UpdateExerciseDto(string Name, int DefaultSets, MuscleGroup? MuscleGroup, ExerciseType? ExerciseType, Equipment? Equipment, Difficulty? Difficulty);
    public record UpdateDayDto(bool IsRestDay);
    public record AssignExerciseDto(int PlanExerciseId, int Sets);
    public record UpdateLogEntryDto(bool IsCompleted, int? Reps, decimal? WeightKg);
}
