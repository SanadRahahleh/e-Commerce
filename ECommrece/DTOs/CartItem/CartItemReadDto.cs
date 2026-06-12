namespace ECommrece.DTOs.CartItem
{
    public class CartItemReadDto
    {
        public int Id { get; set; }

        public int ProductID { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public decimal ProductPrice { get; set; }

        public int Quantity { get; set; }
    }
}