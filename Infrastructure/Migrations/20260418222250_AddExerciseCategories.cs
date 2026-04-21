using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddExerciseCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Difficulty",
                table: "PlanExercises",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Equipment",
                table: "PlanExercises",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExerciseType",
                table: "PlanExercises",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MuscleGroup",
                table: "PlanExercises",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "PlanExercises");

            migrationBuilder.DropColumn(
                name: "Equipment",
                table: "PlanExercises");

            migrationBuilder.DropColumn(
                name: "ExerciseType",
                table: "PlanExercises");

            migrationBuilder.DropColumn(
                name: "MuscleGroup",
                table: "PlanExercises");
        }
    }
}
