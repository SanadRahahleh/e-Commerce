using ECommrece.Models;

namespace ECommerce.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderID { get; set; }

        public int ProductID { get; set; }

        public int Quantity { get; set; }

        public decimal PriceAtTime { get; set; }

        // Relations
        public Order Order { get; set; }

        public Product Product { get; set; }
    }
}