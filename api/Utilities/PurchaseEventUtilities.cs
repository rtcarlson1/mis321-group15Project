using api.Models;
using System.Data;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Runtime.InteropServices;
 
namespace api.Utilities
{
    public class PurchaseEventUtilities
    {
        public List<PurchaseEvent> GetAllPurchaseEvents()
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = "SELECT * FROM PurchaseEvents ORDER BY PurchaseID ASC";
            using var cmd = new MySqlCommand(stm, con);
            MySqlDataReader rdr = cmd.ExecuteReader();
            List<PurchaseEvent> Allpurchaseevents = new List<PurchaseEvent>();
            while(rdr.Read())
            {
                Allpurchaseevents.Add(new PurchaseEvent(){PurchaseID = rdr.GetInt32(0), Date = rdr.GetString(1), Deleted = rdr.GetBoolean(2), VendID = rdr.GetInt32(3), ProductID = rdr.GetInt32(4)});
            }
            con.Close();
            return Allpurchaseevents;
        }
 
        public void NewPurchaseEvent(PurchaseEvent myPurchaseEvent)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
 
            string stm = @"INSERT INTO PurchaseEvents (Date, Deleted, VendID, ProductID) VALUES(@Date, @Deleted, @VendID, @ProductID)";
 
            using var cmd = new MySqlCommand(stm, con);
 
            cmd.Parameters.AddWithValue("@Date", myPurchaseEvent.Date);
            cmd.Parameters.AddWithValue("@Deleted", myPurchaseEvent.Deleted);
            cmd.Parameters.AddWithValue("@VendID", myPurchaseEvent.VendID);
            cmd.Parameters.AddWithValue("@ProductID", myPurchaseEvent.ProductID);
 
            cmd.Prepare();
 
            cmd.ExecuteNonQuery();
        }
 
        public void UpdatePurchaseEvent(PurchaseEvent value)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = @"UPDATE PurchaseEvents SET Date = @Date, ProductID = @ProductID WHERE PurchaseID = @ID";
            MySqlCommand cmd = new MySqlCommand(stm, con);
           
            cmd.Parameters.AddWithValue("@Date", value.Date);
            cmd.Parameters.AddWithValue("@ProductID", value.ProductID);
            cmd.Parameters.AddWithValue("@ID", value.PurchaseID);
           
            cmd.Prepare();
            cmd.ExecuteNonQuery();
            con.Close();
        }
 
        public void DeletePurchaseEvent(PurchaseEvent value)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
 
            string stm = @"UPDATE PurchaseEvents SET Deleted = 1 WHERE PurchaseID = @id";
 
            using var cmd = new MySqlCommand(stm, con);
            cmd.Parameters.AddWithValue("@id", value.PurchaseID);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
 
    }
}