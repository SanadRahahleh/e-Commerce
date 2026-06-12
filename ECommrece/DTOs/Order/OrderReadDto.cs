using ECommrece.DTOs.OrderItem;

namespace ECommrece.DTOs.Order
{
    public class OrderReadDto
    {
        public int Id { get; set; }

        public string Address { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; }
        public List<OrderItemReadDto> Items { get; set; }
            = new();
    }
}