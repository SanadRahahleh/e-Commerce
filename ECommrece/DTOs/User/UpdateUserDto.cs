using System.ComponentModel.DataAnnotations;

namespace ECommrece.DTOs.User
{
    public class UpdateUserDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}