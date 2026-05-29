namespace ECommrece.DTOs.Cart
{
    public class CartReadDto
    {
        public int ProductID { get; set; }

        public string ProductName { get; set; }

        public decimal PriceAtTime { get; set; }

        public int Quantity { get; set; }
    }
}