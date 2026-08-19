using ECommrece.Data;
using ECommrece.DTOs.Product;
using ECommrece.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.FControllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////
        // GET ALL PRODUCTS
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Select(p => new ProductReadDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    CategoryID = p.CategoryID,
                    Description = p.Description,
                    StockQuantity = p.StockQuantity,
                    IsActive = p.IsActive
                })
                    .ToListAsync();


            return Ok(products);
        }


        ////////////////////////////////////////////////////////////
        // GET PRODUCT BY ID
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new ProductReadDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Description = p.Description,
                    CategoryID = p.CategoryID,
                    StockQuantity = p.StockQuantity,
                    IsActive = p.IsActive
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound("Product Not Found");
            }

            return Ok(product);
        }


        ////////////////////////////////////////////////////////////
        // CREATE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryID);

            if (!categoryExists)
            {
                return BadRequest("Category not found.");
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ImageUrl = dto.ImageUrl,
                IsActive = dto.IsActive,
                CategoryID = dto.CategoryID,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = product.Id },
                product
            );
        }


        ////////////////////////////////////////////////////////////
        // UPDATE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Product Not Found");
            }

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryID);

            if (!categoryExists)
            {
                return BadRequest("Category Not Found");
            }

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.ImageUrl = dto.ImageUrl;
            product.IsActive = dto.IsActive;
            product.CategoryID = dto.CategoryID;

            await _context.SaveChangesAsync();

            return Ok(product);
        }


        ////////////////////////////////////////////////////////////
        // DELETE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Product Not Found");
            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
    }