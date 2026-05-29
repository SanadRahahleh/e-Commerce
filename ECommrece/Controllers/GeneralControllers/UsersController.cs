using ECommrece.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Models;

namespace ECommerce.Controllers.GeneralControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        //////////////////////////////////////////////////////

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users.ToListAsync();

            return Ok(users);
        }

        //////////////////////////////////////////////////////

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User Not Found");
            }

            return Ok(user);
        }

        //////////////////////////////////////////////////////

        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = user.Id },
                user
            );
        }

        //////////////////////////////////////////////////////

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, User updatedUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User Not Found");
            }

            user.FullName = updatedUser.FullName;
            user.Email = updatedUser.Email;
            user.Password = updatedUser.Password;
            user.Phone = updatedUser.Phone;
            user.Address = updatedUser.Address;
            user.Role = updatedUser.Role;

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        //////////////////////////////////////////////////////

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User Not Found");
            }

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return Ok("User Deleted Successfully");
        }
    }
}