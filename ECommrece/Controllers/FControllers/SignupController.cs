using ECommerce.Models;
using ECommrece.Data;
using ECommrece.DTOs.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.FControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignupController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SignupController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost()]
        public async Task<IActionResult> Signup(CreateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (existingUser != null)
            {
                return BadRequest("Email already exists");
            }

            // Create new user
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,

                // Password Hashing
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Customer"

            };

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Account created successfully",
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = "Customer"

            });
        }
    }
}