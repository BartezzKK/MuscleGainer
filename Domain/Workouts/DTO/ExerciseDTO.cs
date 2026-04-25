using System.Collections.Generic;

namespace Domain.Workouts.DTO
{
    public class ExerciseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
        public List<ExerciseSetDTO> Sets { get; set; } = new();
        public List<ExerciseSetDTO> PreviousSets { get; set; } = new();
    }
}
