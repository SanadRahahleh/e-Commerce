namespace ECommrece.DTOs.Product
{
    public class ProductReadDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int CategoryID { get; set; }
        public int StockQuantity { get; set; }
        public bool IsActive { get; set; }
    }
}