using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.Payment
{
    public class CreatePaymentDto
    {
        [Required]
        public int OrderID { get; set; }

        [Required]
        public string Method { get; set; } = string.Empty;
    }
}