using Domain.Stats;
using Domain.Stats.DTO;
using Domain.Workouts.DTO;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class StatsService : IStatsService
    {
        private readonly AppDbContext _context;

        public StatsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDTO> GetDashboard(int userId)
        {
            var workouts = await _context.Workouts
                .Where(w => w.UserId == userId)
                .Include(w => w.Exercises)
                    .ThenInclude(e => e.Sets)
                .OrderByDescending(w => w.Date)
                .ToListAsync();

            int totalWorkouts = workouts.Count;
            int totalExercises = workouts.Sum(w => w.Exercises.Count);
            int totalSets = workouts.Sum(w => w.Exercises.Sum(e => e.Sets.Count));
            decimal totalVolume = workouts.Sum(w =>
                w.Exercises.Sum(e =>
                    e.Sets.Sum(s => s.Weight * s.Reps)));

            var lastWorkout = workouts.FirstOrDefault();
            WorkoutDTO? lastWorkoutDTO = lastWorkout is null ? null : new WorkoutDTO
            {
                Id = lastWorkout.Id,
                Name = lastWorkout.Name,
                Date = lastWorkout.Date,
                CreatedAt = lastWorkout.CreatedAt,
                Exercises = lastWorkout.Exercises
                    .OrderBy(e => e.Order)
                    .Select(e => new ExerciseDTO
                    {
                        Id = e.Id,
                        Name = e.Name,
                        Order = e.Order,
                        Sets = e.Sets.OrderBy(s => s.Order).Select(s => new ExerciseSetDTO
                        {
                            Id = s.Id,
                            Reps = s.Reps,
                            Weight = s.Weight,
                            Order = s.Order
                        }).ToList()
                    }).ToList()
            };

            var recentWorkouts = workouts.Take(5).Select(w => new RecentWorkoutDTO
            {
                Id = w.Id,
                Name = w.Name,
                Date = w.Date,
                ExerciseCount = w.Exercises.Count,
                SetCount = w.Exercises.Sum(e => e.Sets.Count),
                Volume = w.Exercises.Sum(e => e.Sets.Sum(s => s.Weight * s.Reps))
            }).ToList();

            return new DashboardDTO
            {
                TotalWorkouts = totalWorkouts,
                TotalExercises = totalExercises,
                TotalSets = totalSets,
                TotalVolume = totalVolume,
                LastWorkout = lastWorkoutDTO,
                RecentWorkouts = recentWorkouts
            };
        }

        public async Task<List<string>> GetExerciseNames(int userId)
        {
            return await _context.Exercises
                .Where(e => e.Workout.UserId == userId)
                .Select(e => e.Name)
                .Distinct()
                .OrderBy(n => n)
                .ToListAsync();
        }

        public async Task<ExerciseProgressDTO> GetExerciseProgress(int userId, string exerciseName)
        {
            var exercises = await _context.Exercises
                .Where(e => e.Name == exerciseName && e.Workout.UserId == userId)
                .Include(e => e.Sets)
                .Include(e => e.Workout)
                .OrderBy(e => e.Workout.Date)
                .ToListAsync();

            var entries = exercises.Select(e => new ProgressEntryDTO
            {
                Date = e.Workout.Date,
                MaxWeight = e.Sets.Any() ? e.Sets.Max(s => s.Weight) : 0,
                MaxReps = e.Sets.Any() ? e.Sets.Max(s => s.Reps) : 0,
                Volume = e.Sets.Sum(s => s.Weight * s.Reps)
            }).ToList();

            return new ExerciseProgressDTO
            {
                ExerciseName = exerciseName,
                Entries = entries
            };
        }
    }
}
