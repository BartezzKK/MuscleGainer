using System;

namespace Domain.Workouts.DTO
{
    public class CreateWorkoutRequest
    {
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
