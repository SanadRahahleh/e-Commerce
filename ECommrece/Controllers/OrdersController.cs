using ECommrece.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers
{
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
        // GET ALL ORDERS

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .Include(o => o.Payment)
                .ToListAsync();

            return Ok(orders);
        }

        ////////////////////////////////////////////////////////////
        // GET ORDER BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound("Order Not Found");
            }

            return Ok(order);
        }

        ////////////////////////////////////////////////////////////
        // CREATE ORDER

        [HttpPost]
        public async Task<IActionResult> Create(Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.Orders.AddAsync(order);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = order.Id },
                order
            );
        }

        ////////////////////////////////////////////////////////////
        // UPDATE ORDER

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order updatedOrder)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound("Order Not Found");
            }

            order.UserID = updatedOrder.UserID;
            order.Address = updatedOrder.Address;
            order.Status = updatedOrder.Status;
            order.TotalPrice = updatedOrder.TotalPrice;
            order.CreatedAt = updatedOrder.CreatedAt;

            await _context.SaveChangesAsync();

            return Ok(order);
        }

        ////////////////////////////////////////////////////////////
        // DELETE ORDER

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound("Order Not Found");
            }

            _context.Orders.Remove(order);

            await _context.SaveChangesAsync();

            return Ok("Order Deleted Successfully");
        }
    }
}