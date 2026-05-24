using ECommrece.Models;

namespace ECommerce.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        public int CartID { get; set; }

        public int ProductID { get; set; }

        public int Quantity { get; set; }

        public decimal PriceAtTime { get; set; }

        // Relations
        public Cart? Cart { get; set; }

        public Product? Product { get; set; }
    }
}