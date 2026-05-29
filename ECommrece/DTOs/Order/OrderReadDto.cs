namespace ECommrece.DTOs.Order
{
    public class OrderReadDto
    {
        public int ID { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}