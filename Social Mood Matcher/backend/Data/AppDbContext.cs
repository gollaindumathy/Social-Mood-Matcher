using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialMoodMatcher.API.Models;

namespace SocialMoodMatcher.API.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserMood> UserMoods => Set<UserMood>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserMood>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.MoodType).HasConversion<string>();
            entity.HasOne(m => m.User)
                  .WithMany(u => u.Moods)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
