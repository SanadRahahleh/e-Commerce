using ECommrece.Data;
using ECommrece.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommrece.Controllers
{
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Include(p => p.CartItems)
                .Include(p => p.OrderItems)
                .Include(p => p.Reviews)
                .ToListAsync();

            return Ok(products);
        }

        ////////////////////////////////////////////////////////////
        // GET PRODUCT BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Include(p => p.CartItems)
                .Include(p => p.OrderItems)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound("Product Not Found");
            }

            return Ok(product);
        }

        ////////////////////////////////////////////////////////////
        // CREATE PRODUCT

        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product updatedProduct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Product Not Found");
            }

            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.StockQuantity = updatedProduct.StockQuantity;
            product.ImageUrl = updatedProduct.ImageUrl;
            product.IsActive = updatedProduct.IsActive;
            product.CategoryID = updatedProduct.CategoryID;
            product.CreatedAt = updatedProduct.CreatedAt;

            await _context.SaveChangesAsync();

            return Ok(product);
        }

        ////////////////////////////////////////////////////////////
        // DELETE PRODUCT

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

            return Ok("Product Deleted Successfully");
        }
    }
}