using ECommrece.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.GeneralControllers
{
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
        // GET ALL PAYMENTS

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _context.Payments
                .Include(p => p.Order)
                .ToListAsync();

            return Ok(payments);
        }

        ////////////////////////////////////////////////////////////
        // GET PAYMENT BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null)
            {
                return NotFound("Payment Not Found");
            }

            return Ok(payment);
        }

        ////////////////////////////////////////////////////////////
        // CREATE PAYMENT

        [HttpPost]
        public async Task<IActionResult> Create(Payment payment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.Payments.AddAsync(payment);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = payment.Id },
                payment
            );
        }

        ////////////////////////////////////////////////////////////
        // UPDATE PAYMENT

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Payment updatedPayment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound("Payment Not Found");
            }

            payment.OrderID = updatedPayment.OrderID;
            payment.Amount = updatedPayment.Amount;
            payment.Method = updatedPayment.Method;
            payment.Status = updatedPayment.Status;
            payment.PaidAt = updatedPayment.PaidAt;

            await _context.SaveChangesAsync();

            return Ok(payment);
        }

        ////////////////////////////////////////////////////////////
        // DELETE PAYMENT

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound("Payment Not Found");
            }

            _context.Payments.Remove(payment);

            await _context.SaveChangesAsync();

            return Ok("Payment Deleted Successfully");
        }
    }
}