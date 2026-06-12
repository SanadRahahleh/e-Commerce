using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.CartItem
{
    public class CreateCartItemDto
    {
        [Required]
        public int ProductID { get; set; }
        [Required]  
        public int Quantity { get; set; }
    }
}