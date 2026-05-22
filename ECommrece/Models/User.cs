using ECommrece.Models;
namespace ECommerce.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public string Role { get; set; }

        public DateTime CreatedAt { get; set; }

        // Relations
        public Cart Cart { get; set; }

        public ICollection<Order> Orders { get; set; }

        public ICollection<Review> Reviews { get; set; }
    }
}