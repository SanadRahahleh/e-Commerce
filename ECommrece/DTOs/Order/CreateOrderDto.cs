using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.Order
{
    public class CreateOrderDto
    {
        [Required]
        public string ShippingAddress { get; set; }
    }
}