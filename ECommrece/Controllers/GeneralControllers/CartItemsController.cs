using ECommerce.Models;
using ECommrece.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.GeneralControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartItemsController(AppDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cartItems = await _context.CartItems
                .Include(c => c.Cart)
                .Include(c => c.Product)
                .ToListAsync();

            return Ok(cartItems);
        }

        ////////////////////////////////////////////////////////////

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cartItem = await _context.CartItems
                .Include(c => c.Cart)
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cartItem == null)
            {
                return NotFound("Cart Item Not Found");
            }

            return Ok(cartItem);
        }

        ////////////////////////////////////////////////////////////

        [HttpPost]
        public async Task<IActionResult> Create(CartItem item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.CartItems.AddAsync(item);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = item.Id },
                item
            );
        }

        ////////////////////////////////////////////////////////////

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CartItem updatedItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = await _context.CartItems.FindAsync(id);

            if (item == null)
            {
                return NotFound("Cart Item Not Found");
            }

            item.CartID = updatedItem.CartID;
            item.ProductID = updatedItem.ProductID;
            item.Quantity = updatedItem.Quantity;
            item.PriceAtTime = updatedItem.PriceAtTime;

            await _context.SaveChangesAsync();

            return Ok(item);
        }

        ////////////////////////////////////////////////////////////

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.CartItems.FindAsync(id);

            if (item == null)
            {
                return NotFound("Cart Item Not Found");
            }

            _context.CartItems.Remove(item);

            await _context.SaveChangesAsync();

            return Ok("Cart Item Deleted Successfully");
        }
    }
}