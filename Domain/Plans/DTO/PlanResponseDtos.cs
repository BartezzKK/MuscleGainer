using Domain.Enums;

namespace Domain.Plans.DTO
{
    public class PlanDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PlanDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<PlanExerciseDto> Exercises { get; set; } = new();
        public List<PlanDayDto> Days { get; set; } = new();
    }

    public class PlanExerciseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DefaultSets { get; set; }
        public MuscleGroup? MuscleGroup { get; set; }
        public ExerciseType? ExerciseType { get; set; }
        public Equipment? Equipment { get; set; }
        public Difficulty? Difficulty { get; set; }
    }

    public class PlanDayDto
    {
        public int Id { get; set; }
        public int DayOfWeek { get; set; }
        public bool IsRestDay { get; set; }
        public List<PlanDayExerciseDto> Exercises { get; set; } = new();
    }

    public class PlanDayExerciseDto
    {
        public int Id { get; set; }
        public int PlanExerciseId { get; set; }
        public string ExerciseName { get; set; } = string.Empty;
        public int Sets { get; set; }
    }

    public class WeeklyLogDto
    {
        public int Id { get; set; }
        public DateTime WeekStartDate { get; set; }
        public List<WeeklyLogDayDto> Days { get; set; } = new();
    }

    public class WeeklyLogDayDto
    {
        public int DayOfWeek { get; set; }
        public int PlanDayId { get; set; }
        public List<LogEntryDto> Entries { get; set; } = new();
    }

    public class LogEntryDto
    {
        public int Id { get; set; }
        public int SetNumber { get; set; }
        public string ExerciseName { get; set; } = string.Empty;
        public int? Reps { get; set; }
        public decimal? WeightKg { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
