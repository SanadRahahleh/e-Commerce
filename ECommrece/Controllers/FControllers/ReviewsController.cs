using System.Security.Claims;
using ECommerce.Models;
using ECommrece.Data;
using ECommrece.DTOs.Review;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.FControllers
{
    [Authorize]
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
        /// CREATE REVIEW
        [HttpPost]
        public async Task<IActionResult> Create(CreateReviewDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var productExists = await _context.Products
                .AnyAsync(p => p.Id == dto.ProductID);

            if (!productExists)
            {
                return NotFound("Product Not Found");
            }

            var alreadyReviewed = await _context.Reviews
                .AnyAsync(r =>
                    r.UserID == userId &&
                    r.ProductID == dto.ProductID);

            if (alreadyReviewed)
            {
                return BadRequest("You already reviewed this product");
            }

            var review = new Review
            {
                UserID = userId,
                ProductID = dto.ProductID,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review Added Successfully" });
        }


        ////////////////////////////////////////////////////////////
        /// GET REVIEWS FOR A PRODUCT
        [AllowAnonymous]
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetProductReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.ProductID == productId)
                .Select(r => new ReviewReadDto
                {
                    Id = r.Id,
                    UserName = r.User!.FullName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }


        ////////////////////////////////////////////////////////////
        /// DELETE REVIEW
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var review = await _context.Reviews
                .FirstOrDefaultAsync(r =>
                    r.Id == id &&
                    r.UserID == userId);

            if (review == null)
            {
                return NotFound("Review Not Found");
            }

            _context.Reviews.Remove(review);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Review Deleted Successfully" });
        }
    }
}