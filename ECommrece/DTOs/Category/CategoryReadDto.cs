using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.Category
{
    public class CategoryReadDto
    {
        public int Id { get; set; }
        
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}