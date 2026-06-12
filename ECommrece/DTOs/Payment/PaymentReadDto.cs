namespace ECommrece.DTOs.Payment
{
    public class PaymentReadDto
    {
        public int Id { get; set; }

        public int OrderID { get; set; }

        public decimal Amount { get; set; }

        public string Method { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime PaidAt { get; set; }
    }
}