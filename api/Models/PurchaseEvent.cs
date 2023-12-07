namespace api.Models
{
    public class PurchaseEvent
    {
        public int PurchaseID {get; set;}
        public string Date {get; set;}
        public bool Deleted {get; set;}
        public int VendID {get; set;}
        public int ProductID {get; set;}
    }
}