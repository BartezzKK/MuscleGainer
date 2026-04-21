using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Seed
{
    public static class ExerciseSeed
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            if (await context.GlobalExercises.AnyAsync())
                return;

            var assembly = Assembly.GetExecutingAssembly();
            const string resourceName = "Infrastructure.Seed.exercises.json";

            using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream is null)
                throw new FileNotFoundException($"Embedded resource '{resourceName}' not found.");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var exercises = await JsonSerializer.DeserializeAsync<List<GlobalExerciseJson>>(stream, options);

            if (exercises is null || exercises.Count == 0)
                return;

            var entities = exercises.Select(e => new GlobalExercise
            {
                Name = e.Name,
                MuscleGroup = e.MuscleGroup,
                ExerciseType = e.ExerciseType,
                Equipment = e.Equipment,
                Difficulty = e.Difficulty,
            }).ToList();

            context.GlobalExercises.AddRange(entities);
            await context.SaveChangesAsync();
        }

        private sealed record GlobalExerciseJson(
            string Name,
            [property: JsonConverter(typeof(JsonStringEnumConverter))] MuscleGroup? MuscleGroup,
            [property: JsonConverter(typeof(JsonStringEnumConverter))] ExerciseType? ExerciseType,
            [property: JsonConverter(typeof(JsonStringEnumConverter))] Equipment? Equipment,
            [property: JsonConverter(typeof(JsonStringEnumConverter))] Difficulty? Difficulty
        );
    }
}
