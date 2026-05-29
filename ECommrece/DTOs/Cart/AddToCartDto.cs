using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.Cart
{
    public class AddToCartDto
    {
        public int ProductID { get; set; }

        [Range(1, 100)]
        public int Quantity { get; set; }
    }
}