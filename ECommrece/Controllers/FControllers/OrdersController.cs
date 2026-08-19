using System.Security.Claims;
using ECommerce.Models;
using ECommrece.Data;
using ECommrece.DTOs.Order;
using ECommrece.DTOs.OrderItem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.FControllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }


        ////////////////////////////////////////////////////////////
        // CHECKOUT
        [HttpPost]
        public async Task<IActionResult> Create(CreateOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserID == userId);

            if (cart == null || !cart.CartItems.Any())
            {
                return BadRequest("Cart Is Empty");
            }

            // Check Stock
            foreach (var item in cart.CartItems)
            {
                if (item.Product == null)
                {
                    return BadRequest("Product Not Found");
                }

                if (item.Quantity > item.Product.StockQuantity)
                {
                    return BadRequest(
                        $"Not enough stock for {item.Product.Name}");
                }
            }

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                if (!string.IsNullOrEmpty(dto.Phone))
                {
                    user.Phone = dto.Phone;
                }
                if (!string.IsNullOrEmpty(dto.Address))
                {
                    user.Address = dto.Address;
                }
            }

            decimal totalPrice = 0;

            var order = new Order
            {
                UserID = userId,
                Address = dto.Address,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();


            foreach (var item in cart.CartItems)
            {
                var orderItem = new OrderItem
                {
                    OrderID = order.Id,
                    ProductID = item.ProductID,
                    Quantity = item.Quantity,
                    PriceAtTime = item.Product!.Price
                };

                totalPrice += item.Quantity * item.Product.Price;

                await _context.OrderItems.AddAsync(orderItem);
            }

            order.TotalPrice = totalPrice;

            // Empty Cart
            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Order Created Successfully",
                OrderId = order.Id,
                TotalPrice = order.TotalPrice
            });
        }

        ////////////////////////////////////////////////////////////
        // GET MY ORDERS


        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserID == userId)
                .ToListAsync();

            var result = orders.Select(order =>
                new OrderReadDto
                {
                    Id = order.Id,
                    Address = order.Address,
                    Status = order.Status,
                    TotalPrice = order.TotalPrice,
                    CreatedAt = order.CreatedAt,

                    Items = order.OrderItems!
                        .Select(item =>
                            new OrderItemReadDto
                            {
                                Id = item.Id,
                                ProductID = item.ProductID,
                                ProductName = item.Product!.Name,
                                Quantity = item.Quantity,
                                PriceAtTime = item.PriceAtTime
                            })
                        .ToList()
                });

            return Ok(result);
        }
        ////////////////////////////////////////////////////////////
        // GET ORDER BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o =>
                    o.Id == id &&
                    o.UserID == userId);

            if (order == null)
            {
                return NotFound("Order Not Found");
            }

            var result = new OrderReadDto
            {
                Id = order.Id,
                Address = order.Address,
                Status = order.Status,
                TotalPrice = order.TotalPrice,
                CreatedAt = order.CreatedAt,

                Items = order.OrderItems!
                    .Select(item =>
                        new OrderItemReadDto
                        {
                            Id = item.Id,
                            ProductID = item.ProductID,
                            ProductName = item.Product!.Name,
                            Quantity = item.Quantity,
                            PriceAtTime = item.PriceAtTime
                        })
                    .ToList()
            };

            return Ok(result);
        }


        ////////////////////////////////////////////////////////////
        // GET ALL ORDERS (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

            var result = orders.Select(order =>
                new OrderReadDto
                {
                    Id = order.Id,
                    Address = order.Address,
                    Status = order.Status,
                    TotalPrice = order.TotalPrice,
                    CreatedAt = order.CreatedAt,

                    Items = order.OrderItems!
                        .Select(item =>
                            new OrderItemReadDto
                            {
                                Id = item.Id,
                                ProductID = item.ProductID,
                                ProductName = item.Product!.Name,
                                Quantity = item.Quantity,
                                PriceAtTime = item.PriceAtTime
                            })
                        .ToList()
                });

            return Ok(result);
        }


        ////////////////////////////////////////////////////////////
        // UPDATE ORDER STATUS (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound("Order Not Found");
            }

            var allowedStatuses = new List<string> { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
            if (!allowedStatuses.Contains(status))
            {
                return BadRequest("Invalid Status Value");
            }

            order.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Order Status Updated Successfully", Status = order.Status });
        }
    }
}