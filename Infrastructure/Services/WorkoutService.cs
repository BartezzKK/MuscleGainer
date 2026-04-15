using Domain.Entities;
using Domain.Workouts;
using Domain.Workouts.DTO;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class WorkoutService : IWorkoutService
    {
        private readonly AppDbContext _context;

        public WorkoutService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<WorkoutDTO>> GetUserWorkouts(int userId)
        {
            var workouts = await _context.Workouts
                .Where(w => w.UserId == userId)
                .Include(w => w.Exercises)
                    .ThenInclude(e => e.Sets)
                .OrderByDescending(w => w.Date)
                .ToListAsync();

            return workouts.Select(MapToDTO).ToList();
        }

        public async Task<WorkoutDTO?> GetWorkoutById(int id, int userId)
        {
            var workout = await _context.Workouts
                .Where(w => w.Id == id && w.UserId == userId)
                .Include(w => w.Exercises.OrderBy(e => e.Order))
                    .ThenInclude(e => e.Sets.OrderBy(s => s.Order))
                .FirstOrDefaultAsync();

            return workout is null ? null : MapToDTO(workout);
        }

        public async Task<WorkoutDTO> CreateWorkout(int userId, CreateWorkoutRequest request)
        {
            var workout = new Workout
            {
                UserId = userId,
                Name = request.Name,
                Date = request.Date
            };

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();

            return MapToDTO(workout);
        }

        public async Task<WorkoutDTO> AddExercise(int workoutId, int userId, AddExerciseRequest request)
        {
            var workout = await _context.Workouts
                .Where(w => w.Id == workoutId && w.UserId == userId)
                .Include(w => w.Exercises)
                    .ThenInclude(e => e.Sets)
                .FirstOrDefaultAsync();

            if (workout is null)
                throw new Exception("Workout not found.");

            var exercise = new Exercise
            {
                WorkoutId = workoutId,
                Name = request.Name,
                Order = request.Order
            };

            workout.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            return MapToDTO(workout);
        }

        public async Task<ExerciseDTO> AddSet(int exerciseId, int userId, AddSetRequest request)
        {
            var exercise = await _context.Exercises
                .Include(e => e.Workout)
                .Include(e => e.Sets)
                .FirstOrDefaultAsync(e => e.Id == exerciseId && e.Workout.UserId == userId);

            if (exercise is null)
                throw new Exception("Exercise not found.");

            var set = new ExerciseSet
            {
                ExerciseId = exerciseId,
                Reps = request.Reps,
                Weight = request.Weight,
                Order = request.Order
            };

            exercise.Sets.Add(set);
            await _context.SaveChangesAsync();

            return MapExerciseToDTO(exercise);
        }

        public async Task DeleteWorkout(int id, int userId)
        {
            var workout = await _context.Workouts
                .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

            if (workout is null)
                throw new Exception("Workout not found.");

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();
        }

        private static WorkoutDTO MapToDTO(Workout workout)
        {
            return new WorkoutDTO
            {
                Id = workout.Id,
                Name = workout.Name,
                Date = workout.Date,
                CreatedAt = workout.CreatedAt,
                Exercises = workout.Exercises
                    .OrderBy(e => e.Order)
                    .Select(MapExerciseToDTO)
                    .ToList()
            };
        }

        private static ExerciseDTO MapExerciseToDTO(Exercise exercise)
        {
            return new ExerciseDTO
            {
                Id = exercise.Id,
                Name = exercise.Name,
                Order = exercise.Order,
                Sets = exercise.Sets
                    .OrderBy(s => s.Order)
                    .Select(s => new ExerciseSetDTO
                    {
                        Id = s.Id,
                        Reps = s.Reps,
                        Weight = s.Weight,
                        Order = s.Order
                    }).ToList()
            };
        }
    }
}
