namespace ECommerce.DTOs.ProductImage
{
    public class ProductImageReadDto
    {
        public int Id { get; set; }

        public int ProductID { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
    }
}
