namespace Domain.Workouts.DTO
{
    public class AddExerciseRequest
    {
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
