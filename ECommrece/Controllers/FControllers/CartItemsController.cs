using System.Security.Claims;
using ECommerce.Models;
using ECommrece.Data;
using ECommrece.DTOs.CartItem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.GeneralControllers
{
    [Authorize]
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
        // ADD ITEM TO CART
        [HttpPost]
        public async Task<IActionResult> Create(CreateCartItemDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var product = await _context.Products
                .FindAsync(dto.ProductID);

            if (product == null)
            {
                return NotFound("Product Not Found");
            }

            if (dto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0");
            }

            if (dto.Quantity > product.StockQuantity)
            {
                return BadRequest("Not enough stock available 1");
            }

            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserID == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserID = userId
                };

                await _context.Carts.AddAsync(cart);
                await _context.SaveChangesAsync();
            }

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci =>
                    ci.CartID == cart.Id &&
                    ci.ProductID == dto.ProductID);

            if (existingItem != null)
            {
                if (existingItem.Quantity + dto.Quantity > product.StockQuantity)
                {
                    return BadRequest("Not enough stock available 2 ");
                }

                existingItem.Quantity += dto.Quantity;

                await _context.SaveChangesAsync();

                return Ok("Quantity Updated");
            }

            var cartItem = new CartItem
            {
                CartID = cart.Id,
                ProductID = dto.ProductID,
                Quantity = dto.Quantity
            };

            await _context.CartItems.AddAsync(cartItem);
            await _context.SaveChangesAsync();

            return Ok("Product Added To Cart");
        }


        ////////////////////////////////////////////////////////////
        // UPDATE QUANTITY
        [HttpPut("{id}")]
        public async Task<IActionResult> Update( int id,UpdateCartItemDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci =>
                    ci.Id == id &&
                    ci.Cart!.UserID == userId);

            if (cartItem == null)
            {
                return NotFound("Cart Item Not Found");
            }

            cartItem.Quantity = dto.Quantity;

            await _context.SaveChangesAsync();

            return Ok("Quantity Updated Successfully");
        }


        ////////////////////////////////////////////////////////////
        // DELETE ITEM
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci =>
                    ci.Id == id &&
                    ci.Cart!.UserID == userId);

            if (cartItem == null)
            {
                return NotFound("Cart Item Not Found");
            }

            _context.CartItems.Remove(cartItem);

            await _context.SaveChangesAsync();

            return Ok("Cart Item Deleted Successfully");
        }
    }
}