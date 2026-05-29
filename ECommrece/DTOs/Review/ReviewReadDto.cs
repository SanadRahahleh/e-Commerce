namespace ECommrece.DTOs.Review
{
    public class ReviewReadDto
    {
        public string UserName { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}