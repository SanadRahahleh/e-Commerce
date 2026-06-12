using System.Security.Claims;
using ECommerce.Models;
using ECommrece.Data;
using ECommrece.DTOs.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.FControllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////
        // CREATE PAYMENT and Update Quantity

        [HttpPost]
        public async Task<IActionResult> Create(CreatePaymentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o =>
                    o.Id == dto.OrderID &&
                    o.UserID == userId);

            if (order == null)
            {
                return NotFound("Order Not Found");
            }

            var existingPayment = await _context.Payments
                .AnyAsync(p => p.OrderID == order.Id);

            if (existingPayment)
            {
                return BadRequest("Order already paid");
            }

            foreach (var item in order.OrderItems)
            {
                if (item.Product == null)
                {
                    return BadRequest("Product not found");
                }

                if (item.Product.StockQuantity < item.Quantity)
                {
                    return BadRequest(
                        $"Not enough stock for product: {item.Product.Name}");
                }
            }

            foreach (var item in order.OrderItems)
            {
                item.Product!.StockQuantity -= item.Quantity;
            }

            order.Status = "Paid";

            var payment = new Payment
            {
                OrderID = order.Id,
                Amount = order.TotalPrice,
                Method = dto.Method,
                Status = "Paid",
                PaidAt = DateTime.UtcNow
            };

            await _context.Payments.AddAsync(payment);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Payment Created Successfully",
                PaymentId = payment.Id
            });
        }

        ////////////////////////////////////////////////////////////
        // GET MY PAYMENTS

        [HttpGet]
        public async Task<IActionResult> GetMyPayments()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var payments = await _context.Payments
                .Include(p => p.Order)
                .Where(p => p.Order!.UserID == userId)
                .Select(p => new PaymentReadDto
                {
                    Id = p.Id,
                    OrderID = p.OrderID,
                    Amount = p.Amount,
                    Method = p.Method,
                    Status = p.Status,
                    PaidAt = p.PaidAt
                })
                .ToListAsync();

            return Ok(payments);
        }

        ////////////////////////////////////////////////////////////
        // GET PAYMENT BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var payment = await _context.Payments
                .Include(p => p.Order)
                .Where(p =>
                    p.Id == id &&
                    p.Order!.UserID == userId)
                .Select(p => new PaymentReadDto
                {
                    Id = p.Id,
                    OrderID = p.OrderID,
                    Amount = p.Amount,
                    Method = p.Method,
                    Status = p.Status,
                    PaidAt = p.PaidAt
                })
                .FirstOrDefaultAsync();

            if (payment == null)
            {
                return NotFound("Payment Not Found");
            }

            return Ok(payment);
        }
    }
}