namespace Domain.Entities
{
    public class LogEntry
    {
        public int Id { get; set; }
        public int WeeklyLogId { get; set; }
        public WeeklyLog WeeklyLog { get; set; } = null!;
        public int PlanDayExerciseId { get; set; }
        public PlanDayExercise PlanDayExercise { get; set; } = null!;
        public int SetNumber { get; set; }
        public int? Reps { get; set; }
        public decimal? WeightKg { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime? CompletedAt { get; set; }
    }
}
