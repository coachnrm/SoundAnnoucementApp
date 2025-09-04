using System.ComponentModel.DataAnnotations;

namespace SoundAnnoucementApp.Dtos
{
    public class QueueDepartmentCreateDto
    {
        [Required(ErrorMessage = "กรุณากรอกชื่อแผนก")]
        [StringLength(100, ErrorMessage = "ชื่อแผนกต้องไม่เกิน 100 ตัวอักษร")]
        public string Name { get; set; } = string.Empty;
    }
}