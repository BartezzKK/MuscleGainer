namespace Domain.Entities
{
    public class WeeklyLog
    {
        public int Id { get; set; }
        public int TrainingPlanId { get; set; }
        public TrainingPlan TrainingPlan { get; set; } = null!;
        public DateTime WeekStartDate { get; set; }

        public List<LogEntry> Entries { get; set; } = new();
    }
}
