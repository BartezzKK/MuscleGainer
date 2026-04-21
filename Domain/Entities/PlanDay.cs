namespace Domain.Entities
{
    public class PlanDay
    {
        public int Id { get; set; }
        public int TrainingPlanId { get; set; }
        public TrainingPlan TrainingPlan { get; set; } = null!;
        public DayOfWeek DayOfWeek { get; set; }
        public bool IsRestDay { get; set; } = false;

        public List<PlanDayExercise> Exercises { get; set; } = new();
    }
}
