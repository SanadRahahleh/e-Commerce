using System.Security.Claims;
using ECommrece.Data;
using ECommrece.DTOs.Cart;
using ECommrece.DTOs.CartItem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.FControllers
{
    [Authorize]
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
        // GET MY CART

        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserID == userId);

            if (cart == null)
            {
                return NotFound("Cart Not Found");
            }

            var result = new CartReadDto
            {
                Id = cart.Id,
                CreatedAt = cart.CreatedAt,

                Items = cart.CartItems!.Select(ci =>
                    new CartItemReadDto
                    {
                        Id = ci.Id,
                        ProductID = ci.ProductID,
                        ProductName = ci.Product!.Name,
                        ProductPrice = ci.Product.Price,
                        Quantity = ci.Quantity
                    })
                    .ToList()
            };

            return Ok(result);
        }

        ////////////////////////////////////////////////////////////
        // CLEAR CART

        [HttpDelete("Clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserID == userId);

            if (cart == null)
            {
                return NotFound("Cart Not Found");
            }

            if (cart.CartItems == null || !cart.CartItems.Any())
            {
                return BadRequest("Cart Is Empty");
            }

            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Cart Cleared Successfully" });
        }
    }
}