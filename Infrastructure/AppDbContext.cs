using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Workout> Workouts => Set<Workout>();
        public DbSet<Exercise> Exercises => Set<Exercise>();
        public DbSet<ExerciseSet> ExerciseSets => Set<ExerciseSet>();

        public DbSet<GlobalExercise> GlobalExercises => Set<GlobalExercise>();
        public DbSet<TrainingPlan> TrainingPlans => Set<TrainingPlan>();
        public DbSet<PlanExercise> PlanExercises => Set<PlanExercise>();
        public DbSet<PlanDay> PlanDays => Set<PlanDay>();
        public DbSet<PlanDayExercise> PlanDayExercises => Set<PlanDayExercise>();
        public DbSet<WeeklyLog> WeeklyLogs => Set<WeeklyLog>();
        public DbSet<LogEntry> LogEntries => Set<LogEntry>();
        public DbSet<BodyWeightLog> BodyWeightLogs => Set<BodyWeightLog>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<User>(entity =>
            {
                entity.HasKey(k=> k.Id);
                entity.Property(p => p.Email).IsRequired().HasMaxLength(200);
                entity.HasIndex(i => i.Email).IsUnique();
            });

            builder.Entity<Workout>(entity =>
            {
                entity.HasKey(w => w.Id);
                entity.Property(w => w.Name).IsRequired().HasMaxLength(200);
                entity.HasOne(w => w.User)
                      .WithMany()
                      .HasForeignKey(w => w.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Exercise>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.HasOne(e => e.Workout)
                      .WithMany(w => w.Exercises)
                      .HasForeignKey(e => e.WorkoutId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<ExerciseSet>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Weight).HasColumnType("decimal(8,2)");
                entity.HasOne(s => s.Exercise)
                      .WithMany(e => e.Sets)
                      .HasForeignKey(s => s.ExerciseId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<GlobalExercise>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            });

            builder.Entity<TrainingPlan>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
                entity.HasOne(p => p.User)
                      .WithMany()
                      .HasForeignKey(p => p.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<PlanExercise>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.HasOne(e => e.TrainingPlan)
                      .WithMany(p => p.Exercises)
                      .HasForeignKey(e => e.TrainingPlanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<PlanDay>(entity =>
            {
                entity.HasKey(d => d.Id);
                entity.HasOne(d => d.TrainingPlan)
                      .WithMany(p => p.Days)
                      .HasForeignKey(d => d.TrainingPlanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<PlanDayExercise>(entity =>
            {
                entity.HasKey(de => de.Id);
                entity.HasOne(de => de.PlanDay)
                      .WithMany(d => d.Exercises)
                      .HasForeignKey(de => de.PlanDayId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(de => de.PlanExercise)
                      .WithMany(e => e.PlanDayExercises)
                      .HasForeignKey(de => de.PlanExerciseId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<WeeklyLog>(entity =>
            {
                entity.HasKey(l => l.Id);
                entity.HasOne(l => l.TrainingPlan)
                      .WithMany(p => p.WeeklyLogs)
                      .HasForeignKey(l => l.TrainingPlanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<LogEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.WeightKg).HasColumnType("decimal(8,2)");
                entity.HasOne(e => e.WeeklyLog)
                      .WithMany(l => l.Entries)
                      .HasForeignKey(e => e.WeeklyLogId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.PlanDayExercise)
                      .WithMany(de => de.LogEntries)
                      .HasForeignKey(e => e.PlanDayExerciseId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<BodyWeightLog>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.WeightKg).HasColumnType("decimal(6,2)");
                entity.HasOne(b => b.User)
                      .WithMany()
                      .HasForeignKey(b => b.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(b => b.Workout)
                      .WithMany()
                      .HasForeignKey(b => b.WorkoutId)
                      .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
