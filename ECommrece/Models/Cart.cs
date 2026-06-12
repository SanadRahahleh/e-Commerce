using ECommrece.Models;

namespace ECommerce.Models
{
    public class Cart
    {
        public int Id { get; set; }

        public int UserID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relations
        public User? User { get; set; }

        public ICollection<CartItem>? CartItems { get; set; }
    }
}