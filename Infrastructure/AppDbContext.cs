using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

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
        }
    }
}
