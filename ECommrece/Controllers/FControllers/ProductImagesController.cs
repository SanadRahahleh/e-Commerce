using ECommerce.DTOs.ProductImage;
using ECommerce.Models;
using ECommrece.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers.FControllers
{
    [Authorize]
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
                .Select(p => new ProductImageReadDto
                {
                    Id = p.Id,
                    ProductID = p.ProductID,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();

            return Ok(productImages);
        }

        ////////////////////////////////////////////////////////////
        // GET PRODUCT IMAGE BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var productImage = await _context.ProductImages
                .Where(p => p.Id == id)
                .Select(p => new ProductImageReadDto
                {
                    Id = p.Id,
                    ProductID = p.ProductID,
                    ImageUrl = p.ImageUrl
                })
                .FirstOrDefaultAsync();

            if (productImage == null)
            {
                return NotFound("Product Image Not Found");
            }

            return Ok(productImage);
        }

        ////////////////////////////////////////////////////////////
        // CREATE PRODUCT IMAGE

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateProductImageDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var productImage = new ProductImage
            {
                ProductID = dto.ProductID,
                ImageUrl = dto.ImageUrl
            };

            await _context.ProductImages.AddAsync(productImage);

            await _context.SaveChangesAsync();

            var readDto = new ProductImageReadDto
            {
                Id = productImage.Id,
                ProductID = productImage.ProductID,
                ImageUrl = productImage.ImageUrl
            };

            return CreatedAtAction(
                nameof(GetById),
                new { id = productImage.Id },
                readDto
            );
        }

        ////////////////////////////////////////////////////////////
        // UPDATE PRODUCT IMAGE
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,UpdateProductImageDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var productImage =
                await _context.ProductImages.FindAsync(id);

            if (productImage == null)
            {
                return NotFound("Product Image Not Found");
            }

            productImage.ProductID = dto.ProductID;
            productImage.ImageUrl = dto.ImageUrl;

            await _context.SaveChangesAsync();

            return Ok();
        }

        ////////////////////////////////////////////////////////////
        // DELETE PRODUCT IMAGE
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var productImage = await _context.ProductImages
                .FindAsync(id);

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