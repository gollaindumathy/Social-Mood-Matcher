using Microsoft.EntityFrameworkCore;
using SocialMoodMatcher.API.Data;
using SocialMoodMatcher.API.DTOs;
using SocialMoodMatcher.API.Models;

namespace SocialMoodMatcher.API.Services;

public class MoodMatchingService
{
    private readonly AppDbContext _db;

    public MoodMatchingService(AppDbContext db)
    {
        _db = db;
    }

    // Get feed: mood posts from users who share the same current mood as the requesting user
    public async Task<List<MoodResponseDto>> GetFeedAsync(string userId)
    {
        // Get user's latest mood (within last 2 hours)
        var cutoff = DateTime.UtcNow.AddHours(-2);
        var myLatestMood = await _db.UserMoods
            .Where(m => m.UserId == userId && m.CreatedAt >= cutoff)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync();

        if (myLatestMood == null)
            return new List<MoodResponseDto>();

        // Find all moods (from other users) with same mood type in last 2 hours
        var matchingMoods = await _db.UserMoods
            .Include(m => m.User)
            .Where(m => m.UserId != userId
                     && m.MoodType == myLatestMood.MoodType
                     && m.CreatedAt >= cutoff)
            .OrderByDescending(m => m.CreatedAt)
            .Take(50)
            .ToListAsync();

        return matchingMoods.Select(m => new MoodResponseDto(
            m.Id,
            m.UserId,
            m.User.DisplayName,
            m.User.AvatarColor,
            m.MoodType,
            m.Description,
            m.CreatedAt
        )).ToList();
    }

    // Get matched users: unique people sharing the same current mood
    public async Task<List<MatchedUserDto>> GetMatchedUsersAsync(string userId)
    {
        var cutoff = DateTime.UtcNow.AddHours(-2);

        // User's latest mood
        var myLatestMood = await _db.UserMoods
            .Where(m => m.UserId == userId && m.CreatedAt >= cutoff)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync();

        if (myLatestMood == null)
            return new List<MatchedUserDto>();

        // For each other user, get their latest mood and check if it matches
        var matchingUsers = await _db.UserMoods
            .Include(m => m.User)
            .Where(m => m.UserId != userId && m.CreatedAt >= cutoff)
            // Ensure this is their LATEST mood
            .Where(m => !_db.UserMoods.Any(newer => newer.UserId == m.UserId && newer.CreatedAt > m.CreatedAt))
            // Check if their latest mood matches my latest mood
            .Where(m => m.MoodType == myLatestMood.MoodType)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return matchingUsers.Select(m => new MatchedUserDto(
            m.UserId,
            m.User.DisplayName,
            m.User.AvatarColor,
            m.MoodType,
            m.Description,
            m.CreatedAt
        )).ToList();
    }
}
