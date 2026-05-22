using ECommerce.Models;
namespace ECommrece.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public string ImageUrl { get; set; }

        public bool IsActive { get; set; }

        public int CategoryID { get; set; }

        public DateTime CreatedAt { get; set; }

        // Relations
        public Category Category { get; set; }

        public ICollection<ProductImage> ProductImages { get; set; }

        public ICollection<CartItem> CartItems { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }

        public ICollection<Review> Reviews { get; set; }
    }
}
