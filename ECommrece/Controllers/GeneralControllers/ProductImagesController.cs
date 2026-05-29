using ECommrece.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.GeneralControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductImagesController(AppDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////
        // GET ALL PRODUCT IMAGES

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var productImages = await _context.ProductImages
                .Include(p => p.Product)
                .ToListAsync();

            return Ok(productImages);
        }

        ////////////////////////////////////////////////////////////
        // GET PRODUCT IMAGE BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var productImage = await _context.ProductImages
                .Include(p => p.Product)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (productImage == null)
            {
                return NotFound("Product Image Not Found");
            }

            return Ok(productImage);
        }

        ////////////////////////////////////////////////////////////
        // CREATE PRODUCT IMAGE

        [HttpPost]
        public async Task<IActionResult> Create(ProductImage productImage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.ProductImages.AddAsync(productImage);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = productImage.Id },
                productImage
            );
        }

        ////////////////////////////////////////////////////////////
        // UPDATE PRODUCT IMAGE

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProductImage updatedProductImage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var productImage = await _context.ProductImages.FindAsync(id);

            if (productImage == null)
            {
                return NotFound("Product Image Not Found");
            }

            productImage.ProductID = updatedProductImage.ProductID;
            productImage.ImageUrl = updatedProductImage.ImageUrl;

            await _context.SaveChangesAsync();

            return Ok(productImage);
        }

        ////////////////////////////////////////////////////////////
        // DELETE PRODUCT IMAGE

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var productImage = await _context.ProductImages.FindAsync(id);

            if (productImage == null)
            {
                return NotFound("Product Image Not Found");
            }

            _context.ProductImages.Remove(productImage);

            await _context.SaveChangesAsync();

            return Ok("Product Image Deleted Successfully");
        }
    }
}