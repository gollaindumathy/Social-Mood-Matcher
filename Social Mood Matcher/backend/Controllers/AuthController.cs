using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialMoodMatcher.API.DTOs;
using SocialMoodMatcher.API.Models;
using SocialMoodMatcher.API.Services;
using System.Security.Claims;

namespace SocialMoodMatcher.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly TokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, TokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) != null)
            return BadRequest(new { message = "Email already in use." });

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            DisplayName = dto.DisplayName,
            AvatarColor = GenerateAvatarColor(dto.DisplayName)
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        return Ok(new AuthResponseDto(
            _tokenService.CreateToken(user),
            user.Id,
            user.Email!,
            user.DisplayName,
            user.AvatarColor
        ));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(new AuthResponseDto(
            _tokenService.CreateToken(user),
            user.Id,
            user.Email!,
            user.DisplayName,
            user.AvatarColor
        ));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue("sub");
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();

        return Ok(new UserProfileDto(
            user.Id, user.Email!, user.DisplayName, user.Bio, user.AvatarColor, user.CreatedAt
        ));
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile(UpdateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue("sub");
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null) return NotFound();

        if (dto.DisplayName != null) user.DisplayName = dto.DisplayName;
        if (dto.Bio != null) user.Bio = dto.Bio;
        if (dto.AvatarColor != null) user.AvatarColor = dto.AvatarColor;

        await _userManager.UpdateAsync(user);

        return Ok(new UserProfileDto(
            user.Id, user.Email!, user.DisplayName, user.Bio, user.AvatarColor, user.CreatedAt
        ));
    }

    private static string GenerateAvatarColor(string name)
    {
        var colors = new[]
        {
            "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
            "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
        };
        var index = Math.Abs(name.GetHashCode()) % colors.Length;
        return colors[index];
    }
}
