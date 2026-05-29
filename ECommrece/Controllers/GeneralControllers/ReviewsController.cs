using ECommrece.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.GeneralControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////
        // GET ALL REVIEWS

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .ToListAsync();

            return Ok(reviews);
        }

        ////////////////////////////////////////////////////////////
        // GET REVIEW BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                return NotFound("Review Not Found");
            }

            return Ok(review);
        }

        ////////////////////////////////////////////////////////////
        // CREATE REVIEW

        [HttpPost]
        public async Task<IActionResult> Create(Review review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.Reviews.AddAsync(review);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = review.Id },
                review
            );
        }

        ////////////////////////////////////////////////////////////
        // UPDATE REVIEW

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Review updatedReview)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
            {
                return NotFound("Review Not Found");
            }

            review.UserID = updatedReview.UserID;
            review.ProductID = updatedReview.ProductID;
            review.Rating = updatedReview.Rating;
            review.Comment = updatedReview.Comment;
            review.CreatedAt = updatedReview.CreatedAt;

            await _context.SaveChangesAsync();

            return Ok(review);
        }

        ////////////////////////////////////////////////////////////
        // DELETE REVIEW

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
            {
                return NotFound("Review Not Found");
            }

            _context.Reviews.Remove(review);

            await _context.SaveChangesAsync();

            return Ok("Review Deleted Successfully");
        }
    }
}