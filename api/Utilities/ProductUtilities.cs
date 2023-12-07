using api.Models;
using System.Data;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Runtime.InteropServices;
using api.Controllers;

namespace api.Utilities
{
    public class ProductUtilities
    {
        public List<Product> GetAllProducts()
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = "SELECT * FROM Products ORDER BY ProductID ASC";
            using var cmd = new MySqlCommand(stm, con);
            // cmd.Prepare();
            MySqlDataReader rdr = cmd.ExecuteReader();
            List<Product> Allproducts = new List<Product>();
            while(rdr.Read())
            {
                Allproducts.Add(new Product(){ProductID = rdr.GetInt32(0), Name = rdr.GetString(1), Quantity = rdr.GetInt32(2), Cost = rdr.GetDouble(3), NumSold = rdr.GetInt32(4), Deleted = rdr.GetBoolean(5), VendID = rdr.GetInt32(6), ImageURL = rdr.GetString(7)});
            }
            con.Close();
            return Allproducts;
        }


        public void CreateProduct(Product myProduct)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            Console.WriteLine("New Product");

            string stm = @"INSERT INTO Products(Quantity, Name, Cost, NumSold, Deleted, VendID) VALUES(@Quantity, @Name, @Cost, @NumSold, @Deleted, @VendID)";

            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@Quantity", myProduct.Quantity);
            cmd.Parameters.AddWithValue("@Name", myProduct.Name);
            cmd.Parameters.AddWithValue("@Cost", myProduct.Cost);
            cmd.Parameters.AddWithValue("@Sold", myProduct.NumSold);
            cmd.Parameters.AddWithValue("@Deleted", myProduct.Deleted);
            cmd.Parameters.AddWithValue("@VendID", myProduct.VendID);

            cmd.Prepare();

            cmd.ExecuteNonQuery();
        }

        public void UpdateProduct(Product value)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = @"UPDATE Products SET Quantity = @Quantity, Name = @Name, Cost = @Cost, NumSold = @NumSold, Deleted = @Deleted, VendID = @VendID, ImageURL = @ImageURL WHERE ProductID = @ProductID";
            MySqlCommand cmd = new MySqlCommand(stm, con);
            
            cmd.Parameters.AddWithValue("@ProductID", value.ProductID);
            cmd.Parameters.AddWithValue("@Quantity", value.Quantity);
            cmd.Parameters.AddWithValue("@Name", value.Name);
            cmd.Parameters.AddWithValue("@Cost", value.Cost);
            cmd.Parameters.AddWithValue("@NumSold", value.NumSold);
            cmd.Parameters.AddWithValue("@Deleted", value.Deleted);
            cmd.Parameters.AddWithValue("@VendID", value.VendID);
            cmd.Parameters.AddWithValue("@ImageURL", value.ImageURL);
            
            cmd.Prepare();
            cmd.ExecuteNonQuery();
            con.Close();
        }

        public void DeleteProduct(Product value)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"UPDATE Products SET Deleted = 1 WHERE ProductID = @id";

            using var cmd = new MySqlCommand(stm, con);
            cmd.Parameters.AddWithValue("@id", value.ProductID);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }

        // Not sure how to get this table to display in Controller if used
        public List<Product> GetSoldProducts()
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = "SELECT * FROM Products WHERE Sold > 1 ORDER BY ProductID ASC";
            using var cmd = new MySqlCommand(stm, con);
            MySqlDataReader rdr = cmd.ExecuteReader();
            List<Product> Allproducts = new List<Product>();
            while(rdr.Read())
            {
                Allproducts.Add(new Product(){ProductID = rdr.GetInt32(0), Name = rdr.GetString(1), Quantity = rdr.GetInt32(2), Cost = rdr.GetDouble(3), NumSold = rdr.GetInt32(4), Deleted = rdr.GetBoolean(5), VendID = rdr.GetInt32(6), ImageURL = rdr.GetString(7)});
            }
            con.Close();
            return Allproducts;
        }


    }
}