using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommrece.Data;
using ECommerce.Models;
using ECommrece.DTOs.Category;

namespace ECommerce.Controllers.FControllers
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
            var categories = await _context.Categories
                .Select(c => new CategoryReadDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToListAsync();

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

            var categoryDto = new CategoryReadDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };

            return Ok(categoryDto);
        }

        ////////////////////////////////////////////////////////////

        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            var categoryDto = new CategoryReadDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };

            return CreatedAtAction(
                nameof(GetCategoryById),
                new { id = category.Id },
                categoryDto
            );
        }

        ////////////////////////////////////////////////////////////

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            category.Name = dto.Name;
            category.Description = dto.Description;

            await _context.SaveChangesAsync();

            var categoryDto = new CategoryReadDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };

            return Ok(categoryDto);
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

            return NoContent();
        }
    }
}