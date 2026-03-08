using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMoodMatcher.API.Data;
using SocialMoodMatcher.API.DTOs;
using SocialMoodMatcher.API.Models;
using SocialMoodMatcher.API.Services;
using System.Security.Claims;

namespace SocialMoodMatcher.API.Controllers;

[ApiController]
[Route("api/moods")]
[Authorize]
public class MoodsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly MoodMatchingService _matchingService;

    public MoodsController(AppDbContext db, MoodMatchingService matchingService)
    {
        _db = db;
        _matchingService = matchingService;
    }

    // POST /api/moods — post a new mood
    [HttpPost]
    public async Task<ActionResult<MoodResponseDto>> PostMood(PostMoodDto dto)
    {
        var userId = GetUserId();
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        var mood = new UserMood
        {
            UserId = userId,
            MoodType = dto.MoodType,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _db.UserMoods.Add(mood);
        await _db.SaveChangesAsync();

        return Ok(new MoodResponseDto(
            mood.Id, mood.UserId, user.DisplayName, user.AvatarColor,
            mood.MoodType, mood.Description, mood.CreatedAt
        ));
    }

    // GET /api/moods/mine — my mood history (last 20)
    [HttpGet("mine")]
    public async Task<ActionResult<List<MoodResponseDto>>> GetMyMoods()
    {
        var userId = GetUserId();
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        var moods = await _db.UserMoods
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .Take(20)
            .Select(m => new MoodResponseDto(
                m.Id, m.UserId, user.DisplayName, user.AvatarColor,
                m.MoodType, m.Description, m.CreatedAt
            ))
            .ToListAsync();

        return Ok(moods);
    }

    // GET /api/moods/feed — posts from users with same current mood
    [HttpGet("feed")]
    public async Task<ActionResult<List<MoodResponseDto>>> GetFeed()
    {
        var feed = await _matchingService.GetFeedAsync(GetUserId());
        return Ok(feed);
    }

    // GET /api/moods/current — my latest mood
    [HttpGet("current")]
    public async Task<ActionResult<MoodResponseDto?>> GetCurrentMood()
    {
        var userId = GetUserId();
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        var mood = await _db.UserMoods
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync();

        if (mood == null) return Ok(null);

        return Ok(new MoodResponseDto(
            mood.Id, mood.UserId, user.DisplayName, user.AvatarColor,
            mood.MoodType, mood.Description, mood.CreatedAt
        ));
    }

    private string GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? string.Empty;
}
