using System;
using System.Collections.Generic;

using System;
using System.Collections.Generic;

namespace Domain.Workouts.DTO
{
    public class WorkoutDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ExerciseDTO> Exercises { get; set; } = new();
        public int? PlanDayId { get; set; }
        public string? PlanName { get; set; }
    }
}
