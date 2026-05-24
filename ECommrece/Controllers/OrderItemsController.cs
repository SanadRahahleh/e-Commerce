using ECommrece.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderItemsController(AppDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////
        // GET ALL ORDER ITEMS

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orderItems = await _context.OrderItems
                .Include(o => o.Order)
                .Include(o => o.Product)
                .ToListAsync();

            return Ok(orderItems);
        }

        ////////////////////////////////////////////////////////////
        // GET ORDER ITEM BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var orderItem = await _context.OrderItems
                .Include(o => o.Order)
                .Include(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (orderItem == null)
            {
                return NotFound("Order Item Not Found");
            }

            return Ok(orderItem);
        }

        ////////////////////////////////////////////////////////////
        // CREATE ORDER ITEM

        [HttpPost]
        public async Task<IActionResult> Create(OrderItem item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.OrderItems.AddAsync(item);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = item.Id },
                item
            );
        }

        ////////////////////////////////////////////////////////////
        // UPDATE ORDER ITEM

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, OrderItem updatedItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = await _context.OrderItems.FindAsync(id);

            if (item == null)
            {
                return NotFound("Order Item Not Found");
            }

            item.OrderID = updatedItem.OrderID;
            item.ProductID = updatedItem.ProductID;
            item.Quantity = updatedItem.Quantity;
            item.PriceAtTime = updatedItem.PriceAtTime;

            await _context.SaveChangesAsync();

            return Ok(item);
        }

        ////////////////////////////////////////////////////////////
        // DELETE ORDER ITEM

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.OrderItems.FindAsync(id);

            if (item == null)
            {
                return NotFound("Order Item Not Found");
            }

            _context.OrderItems.Remove(item);

            await _context.SaveChangesAsync();

            return Ok("Order Item Deleted Successfully");
        }
    }
}