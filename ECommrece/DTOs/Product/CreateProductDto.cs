using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.Product
{
    public class CreateProductDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [Range(1, 100000)]
        public decimal Price { get; set; }

        [Range(0, 10000)]
        public int StockQuantity { get; set; }
        public string ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public int CategoryID { get; set; }

    }
}