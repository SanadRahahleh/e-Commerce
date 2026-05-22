using ECommrece.Models;

namespace ECommerce.Models
{
    public class Category
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        // Relations
        public ICollection<Product> Products { get; set; }
    }
}