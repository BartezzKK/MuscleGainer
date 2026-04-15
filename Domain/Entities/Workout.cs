using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Workout
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<Exercise> Exercises { get; set; } = new();
    }
}
