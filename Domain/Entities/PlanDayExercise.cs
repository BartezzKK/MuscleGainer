namespace Domain.Entities
{
    public class PlanDayExercise
    {
        public int Id { get; set; }
        public int PlanDayId { get; set; }
        public PlanDay PlanDay { get; set; } = null!;
        public int PlanExerciseId { get; set; }
        public PlanExercise PlanExercise { get; set; } = null!;
        public int Sets { get; set; } = 3;

        public List<LogEntry> LogEntries { get; set; } = new();
    }
}
