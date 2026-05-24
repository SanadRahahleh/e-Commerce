using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommrece.Data;
using ECommerce.Models;

namespace ECommrece.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            return Ok(categories);
        }

        ////////////////////////////////////////////////////////////

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            return Ok(category);
        }

        ////////////////////////////////////////////////////////////
        

        [HttpPost]
        public async Task<IActionResult> CreateCategory(Category category)
        {
            await _context.Categories.AddAsync(category);

            await _context.SaveChangesAsync();

            return Ok(category);
        }

        ////////////////////////////////////////////////////////////

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, Category updatedCategory)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            category.Name = updatedCategory.Name;
            category.Description = updatedCategory.Description;

            await _context.SaveChangesAsync();

            return Ok(category);
        }

        ////////////////////////////////////////////////////////////

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();

            return Ok("Category deleted successfully");
        }
    }
}