using ECommrece.Models;

namespace ECommerce.Models
{
    public class ProductImage
    {
        public int Id { get; set; }

        public int ProductID { get; set; }

        public string ImageUrl { get; set; }

        // Relations
        public Product? Product { get; set; }
    }
}