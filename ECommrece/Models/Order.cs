using ECommrece.Models;
namespace ECommerce.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserID { get; set; }

        public string Address { get; set; }

        public string Status { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; }

        // Relations
        public User? User { get; set; }

        public ICollection<OrderItem>? OrderItems { get; set; }

        public Payment? Payment { get; set; }
    }
}