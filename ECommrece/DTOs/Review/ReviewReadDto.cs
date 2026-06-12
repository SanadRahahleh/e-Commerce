namespace ECommrece.DTOs.Review
{
    public class ReviewReadDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}