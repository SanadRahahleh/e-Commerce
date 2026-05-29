using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommrece.Data;
using ECommerce.Models;

namespace ECommerce.Controllers.GeneralControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartsController(AppDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////
        // GET ALL CARTS

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var carts = await _context.Carts
                .Include(c => c.CartItems)
                .ToListAsync();

            return Ok(carts);
        }

        ////////////////////////////////////////////////////////////
        // GET CART BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cart == null)
            {
                return NotFound("Cart Not Found");
            }

            return Ok(cart);
        }

        ////////////////////////////////////////////////////////////
        // CREATE CART

        [HttpPost]
        public async Task<IActionResult> Create(Cart cart)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.Carts.AddAsync(cart);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = cart.Id },
                cart
            );
        }

        ////////////////////////////////////////////////////////////
        // UPDATE CART

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Cart updatedCart)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cart = await _context.Carts.FindAsync(id);

            if (cart == null)
            {
                return NotFound("Cart Not Found");
            }

            cart.UserID = updatedCart.UserID;
            cart.CreatedAt = updatedCart.CreatedAt;

            await _context.SaveChangesAsync();

            return Ok(cart);
        }

        ////////////////////////////////////////////////////////////
        // DELETE CART

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cart = await _context.Carts.FindAsync(id);

            if (cart == null)
            {
                return NotFound("Cart Not Found");
            }

            _context.Carts.Remove(cart);

            await _context.SaveChangesAsync();

            return Ok("Cart Deleted Successfully");
        }
    }
}