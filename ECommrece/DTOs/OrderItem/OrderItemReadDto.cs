namespace ECommrece.DTOs.OrderItem
{
    public class OrderItemReadDto
    {
        public int Id { get; set; }

        public int ProductID { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal PriceAtTime { get; set; }
    }
}