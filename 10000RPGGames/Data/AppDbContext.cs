using Microsoft.EntityFrameworkCore;
using _10000RPGGames.Models;

namespace _10000RPGGames.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Character> Characters { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Character entity
            modelBuilder.Entity<Character>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Level).HasDefaultValue(1);
                entity.Property(e => e.Experience).HasDefaultValue(0);
                entity.Property(e => e.Gold).HasDefaultValue(0);
                entity.HasOne(e => e.CurrentLocation)
                    .WithMany(l => l.Characters)
                    .HasForeignKey(e => e.CurrentLocationId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Location entity
            modelBuilder.Entity<Location>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.BackgroundImageUrl).HasMaxLength(500);
            });

            // Seed data for default locations
            modelBuilder.Entity<Location>().HasData(
                new Location
                {
                    Id = 1,
                    Name = "Làng Tân Thủ",
                    Description = "Ngôi làng yên bình dành cho người chơi mới bắt đầu cuộc phiêu lưu.",
                    X = 0,
                    Y = 0,
                    BackgroundImageUrl = "https://example.com/images/village.png"
                },
                new Location
                {
                    Id = 2,
                    Name = "Khu Rừng Hắc Ám",
                    Description = "Khu rừng bí ẩn với bầu không khí u ám và quái vật.",
                    X = 100,
                    Y = 50,
                    BackgroundImageUrl = "https://example.com/images/dark_forest.png"
                },
                new Location
                {
                    Id = 3,
                    Name = "Hang Rồng",
                    Description = "Hang động sâu thẳm nơi ngọn rồng huyền thoại trú ngụ.",
                    X = 200,
                    Y = 100,
                    BackgroundImageUrl = "https://example.com/images/dragon_cave.png"
                }
            );
        }
    }
}
