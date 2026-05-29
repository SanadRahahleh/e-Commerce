using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.Category
{
    public class UpdateCategoryDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
    }
}