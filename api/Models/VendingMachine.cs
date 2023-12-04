namespace api.Models
{
    public class VendingMachine
    {
        public int VendID {get; set;}
        public string Address {get; set;}
        public int ZipCode {get; set;}
        public bool Deleted{get; set;}
        public int AdminID {get; set;}
    }
}