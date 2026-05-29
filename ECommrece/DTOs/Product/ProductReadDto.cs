namespace ECommrece.DTOs.Product
{
    public class ProductReadDto
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public string CategoryName { get; set; }
    }
}