namespace ECommerce.DTOs.ProductImage
{
    public class CreateProductImageDto
    {
        public int ProductID { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
    }
}
