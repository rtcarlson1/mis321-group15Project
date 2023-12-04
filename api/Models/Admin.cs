namespace api.Models
{
    public class Admin
    {
        public string Password {get; set;}
        public string Email {get; set;}
        public int AdminID {get; set;}
        public bool Deleted {get; set;}

        public Admin(){
            Deleted = false;
            
        }

        

    }
}