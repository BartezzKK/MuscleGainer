namespace Domain.Entities
{
    public class TrainingPlan
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<PlanExercise> Exercises { get; set; } = new();
        public List<PlanDay> Days { get; set; } = new();
        public List<WeeklyLog> WeeklyLogs { get; set; } = new();
    }
}
