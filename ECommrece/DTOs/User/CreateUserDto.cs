using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommrece.DTOs.User
{
    public class CreateUserDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string ConfirmPassword {  get; set; }
        
        public string? Phone { get; set; }
        
        public string? Address { get; set; }
    }
}