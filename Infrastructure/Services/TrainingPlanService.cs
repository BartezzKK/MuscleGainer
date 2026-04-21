using Domain.Entities;
using Domain.Plans;
using Domain.Plans.DTO;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class TrainingPlanService : ITrainingPlanService
    {
        private readonly AppDbContext _context;

        public TrainingPlanService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PlanDto>> GetUserPlans(int userId)
        {
            return await _context.TrainingPlans
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => MapPlan(p))
                .ToListAsync();
        }

        public async Task<PlanDetailsDto?> GetPlanDetails(int planId, int userId)
        {
            var plan = await _context.TrainingPlans
                .Where(p => p.Id == planId && p.UserId == userId)
                .Include(p => p.Exercises)
                .Include(p => p.Days)
                    .ThenInclude(d => d.Exercises)
                        .ThenInclude(de => de.PlanExercise)
                .FirstOrDefaultAsync();

            if (plan is null) return null;

            return new PlanDetailsDto
            {
                Id = plan.Id,
                Name = plan.Name,
                IsActive = plan.IsActive,
                CreatedAt = plan.CreatedAt,
                Exercises = plan.Exercises.Select(MapPlanExercise).ToList(),
                Days = plan.Days
                    .OrderBy(d => d.DayOfWeek)
                    .Select(MapPlanDay)
                    .ToList()
            };
        }

        public async Task<PlanDto> CreatePlan(int userId, CreatePlanDto dto)
        {
            var plan = new TrainingPlan
            {
                UserId = userId,
                Name = dto.Name
            };

            _context.TrainingPlans.Add(plan);
            await _context.SaveChangesAsync();

            // Create 7 PlanDay entries
            var days = Enum.GetValues<DayOfWeek>()
                .Select(day => new PlanDay
                {
                    TrainingPlanId = plan.Id,
                    DayOfWeek = day,
                    IsRestDay = false
                });

            _context.PlanDays.AddRange(days);
            await _context.SaveChangesAsync();

            return MapPlan(plan);
        }

        public async Task<PlanDto?> UpdatePlan(int planId, int userId, UpdatePlanDto dto)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId);

            if (plan is null) return null;

            plan.Name = dto.Name;
            plan.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();

            return MapPlan(plan);
        }

        public async Task<bool> DeletePlan(int planId, int userId)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId);

            if (plan is null) return false;

            _context.TrainingPlans.Remove(plan);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<PlanExerciseDto> AddExercise(int planId, int userId, AddExerciseDto dto)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId);

            if (plan is null) throw new Exception("Plan not found.");

            var exercise = new PlanExercise
            {
                TrainingPlanId = planId,
                Name = dto.Name,
                DefaultSets = dto.DefaultSets,
                MuscleGroup = dto.MuscleGroup,
                ExerciseType = dto.ExerciseType,
                Equipment = dto.Equipment,
                Difficulty = dto.Difficulty
            };

            _context.PlanExercises.Add(exercise);
            await _context.SaveChangesAsync();

            return MapPlanExercise(exercise);
        }

        public async Task<PlanExerciseDto?> UpdateExercise(int planId, int exerciseId, int userId, UpdateExerciseDto dto)
        {
            var exercise = await _context.PlanExercises
                .Include(e => e.TrainingPlan)
                .FirstOrDefaultAsync(e => e.Id == exerciseId && e.TrainingPlanId == planId && e.TrainingPlan.UserId == userId);

            if (exercise is null) return null;

            exercise.Name = dto.Name;
            exercise.DefaultSets = dto.DefaultSets;
            exercise.MuscleGroup = dto.MuscleGroup;
            exercise.ExerciseType = dto.ExerciseType;
            exercise.Equipment = dto.Equipment;
            exercise.Difficulty = dto.Difficulty;
            await _context.SaveChangesAsync();

            return MapPlanExercise(exercise);
        }

        public async Task<bool> DeleteExercise(int planId, int exerciseId, int userId)
        {
            var exercise = await _context.PlanExercises
                .Include(e => e.TrainingPlan)
                .FirstOrDefaultAsync(e => e.Id == exerciseId && e.TrainingPlanId == planId && e.TrainingPlan.UserId == userId);

            if (exercise is null) return false;

            _context.PlanExercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PlanDayDto?> UpdateDay(int planId, int dayId, int userId, UpdateDayDto dto)
        {
            var day = await _context.PlanDays
                .Include(d => d.TrainingPlan)
                .Include(d => d.Exercises)
                    .ThenInclude(de => de.PlanExercise)
                .FirstOrDefaultAsync(d => d.Id == dayId && d.TrainingPlanId == planId && d.TrainingPlan.UserId == userId);

            if (day is null) return null;

            day.IsRestDay = dto.IsRestDay;
            await _context.SaveChangesAsync();

            return MapPlanDay(day);
        }

        public async Task<PlanDayExerciseDto?> AssignExerciseToDay(int planId, int dayId, int userId, AssignExerciseDto dto)
        {
            var day = await _context.PlanDays
                .Include(d => d.TrainingPlan)
                .FirstOrDefaultAsync(d => d.Id == dayId && d.TrainingPlanId == planId && d.TrainingPlan.UserId == userId);

            if (day is null) return null;

            var exercise = await _context.PlanExercises
                .FirstOrDefaultAsync(e => e.Id == dto.PlanExerciseId && e.TrainingPlanId == planId);

            if (exercise is null) return null;

            var existing = await _context.PlanDayExercises
                .FirstOrDefaultAsync(de => de.PlanDayId == dayId && de.PlanExerciseId == dto.PlanExerciseId);

            if (existing is not null)
            {
                existing.Sets = dto.Sets;
                await _context.SaveChangesAsync();
                return MapPlanDayExercise(existing, exercise.Name);
            }

            var pde = new PlanDayExercise
            {
                PlanDayId = dayId,
                PlanExerciseId = dto.PlanExerciseId,
                Sets = dto.Sets
            };

            _context.PlanDayExercises.Add(pde);
            await _context.SaveChangesAsync();

            return MapPlanDayExercise(pde, exercise.Name);
        }

        public async Task<bool> RemoveExerciseFromDay(int planId, int dayId, int planDayExerciseId, int userId)
        {
            var pde = await _context.PlanDayExercises
                .Include(de => de.PlanDay)
                    .ThenInclude(d => d.TrainingPlan)
                .FirstOrDefaultAsync(de => de.Id == planDayExerciseId && de.PlanDayId == dayId && de.PlanDay.TrainingPlanId == planId && de.PlanDay.TrainingPlan.UserId == userId);

            if (pde is null) return false;

            _context.PlanDayExercises.Remove(pde);
            await _context.SaveChangesAsync();
            return true;
        }


        private static PlanDto MapPlan(TrainingPlan p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt
        };

        private static PlanExerciseDto MapPlanExercise(PlanExercise e) => new()
        {
            Id = e.Id,
            Name = e.Name,
            DefaultSets = e.DefaultSets,
            MuscleGroup = e.MuscleGroup,
            ExerciseType = e.ExerciseType,
            Equipment = e.Equipment,
            Difficulty = e.Difficulty
        };

        private static PlanDayDto MapPlanDay(PlanDay d) => new()
        {
            Id = d.Id,
            DayOfWeek = (int)d.DayOfWeek,
            IsRestDay = d.IsRestDay,
            Exercises = d.Exercises.Select(de => MapPlanDayExercise(de, de.PlanExercise?.Name ?? string.Empty)).ToList()
        };

        private static PlanDayExerciseDto MapPlanDayExercise(PlanDayExercise de, string exerciseName) => new()
        {
            Id = de.Id,
            PlanExerciseId = de.PlanExerciseId,
            ExerciseName = exerciseName,
            Sets = de.Sets
        };
    }
}
