using Domain.Entities;
using Domain.Enums;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MuscleGainer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExercisesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExercisesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/exercises?muscleGroup=0&amp;exerciseType=0&amp;equipment=1&amp;difficulty=0
        /// All params are optional – omit to return all exercises.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetExercises(
            [FromQuery] MuscleGroup? muscleGroup,
            [FromQuery] ExerciseType? exerciseType,
            [FromQuery] Equipment? equipment,
            [FromQuery] Difficulty? difficulty)
        {
            var query = _context.GlobalExercises.AsQueryable();

            if (muscleGroup.HasValue)
                query = query.Where(e => e.MuscleGroup == muscleGroup);

            if (exerciseType.HasValue)
                query = query.Where(e => e.ExerciseType == exerciseType);

            if (equipment.HasValue)
                query = query.Where(e => e.Equipment == equipment);

            if (difficulty.HasValue)
                query = query.Where(e => e.Difficulty == difficulty);

            var result = await query
                .OrderBy(e => e.MuscleGroup)
                .ThenBy(e => e.Name)
                .Select(e => new
                {
                    e.Id,
                    e.Name,
                    e.MuscleGroup,
                    e.ExerciseType,
                    e.Equipment,
                    e.Difficulty,
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}
