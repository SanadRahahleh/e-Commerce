using ECommrece.Models;

namespace ECommerce.Models
{
    public class Payment
    {
        public int Id { get; set; }

        public int OrderID { get; set; }

        public decimal Amount { get; set; }

        public string Method { get; set; }

        public string Status { get; set; }

        public DateTime PaidAt { get; set; }

        // Relations
        public Order? Order { get; set; }
    }
}