namespace ECommerce.DTOs.ProductImage
{
    public class UpdateProductImageDto
    {
        public int ProductID { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
    }
}
