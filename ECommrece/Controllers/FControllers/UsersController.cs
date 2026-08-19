using ECommrece.Data;
using ECommrece.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.Controllers.FControllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }


        ////////////////////////////////////////////////////////////
        // GET ALL USERS (Admin Only)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserReadDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role,
                    Phone = u.Phone,
                    Address = u.Address,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }


        ////////////////////////////////////////////////////////////
        // UPDATE USER ROLE (Admin Only)
        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] string role)
        {
            if (string.IsNullOrWhiteSpace(role))
            {
                return BadRequest("Role is required");
            }

            if (role != "Admin" && role != "Customer")
            {
                return BadRequest("Invalid role. Role must be 'Admin' or 'Customer'");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.Role = role;
            await _context.SaveChangesAsync();

            return Ok(new { message = "User role updated successfully" });
        }
    }
}
