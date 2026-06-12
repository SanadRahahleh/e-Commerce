using ECommrece.DTOs.CartItem;

namespace ECommrece.DTOs.Cart
{
    public class CartReadDto
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<CartItemReadDto> Items { get; set; }
            = new();
    }
}