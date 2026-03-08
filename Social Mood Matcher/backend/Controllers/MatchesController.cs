using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMoodMatcher.API.DTOs;
using SocialMoodMatcher.API.Services;
using System.Security.Claims;

namespace SocialMoodMatcher.API.Controllers;

[ApiController]
[Route("api/matches")]
[Authorize]
public class MatchesController : ControllerBase
{
    private readonly MoodMatchingService _matchingService;

    public MatchesController(MoodMatchingService matchingService)
    {
        _matchingService = matchingService;
    }

    // GET /api/matches — people currently feeling the same mood
    [HttpGet]
    public async Task<ActionResult<List<MatchedUserDto>>> GetMatches()
    {
        var userId = GetUserId();
        var matches = await _matchingService.GetMatchedUsersAsync(userId);
        return Ok(matches);
    }

    private string GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? string.Empty;
}
