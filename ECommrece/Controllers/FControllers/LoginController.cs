using ECommerce.Models;
using ECommrece.Data;
using ECommrece.DTOs.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.FControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost()]
        public async Task<IActionResult> Login(LoginUserDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            // Temporary password check
            // Later replace with BCrypt.Verify()

            if (user.Password != loginDto.Password)
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(new
            {
                Message = "Login successful",
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email
            });
        }
    }
}