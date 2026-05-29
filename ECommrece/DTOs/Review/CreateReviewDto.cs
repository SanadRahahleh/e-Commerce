using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.Review
{
    public class CreateReviewDto
    {
        public int ProductID { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(500)]
        public string Comment { get; set; }
    }
}