namespace api.Models
{
    public class Product 
    {
        public int ProductID {get; set;}
        public string Name {get; set;}
        public int Quantity {get; set;}
        public double Cost {get; set;}
        public int NumSold {get; set;}
        public bool Deleted {get; set;}
        public int VendID {get; set;}

        public Product(){
            Deleted = false;
        }

    }
}