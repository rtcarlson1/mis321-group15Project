using api.Models;
using System.Data;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Runtime.InteropServices;

namespace api.Utilities
{
    public class VendingMachineUtilities
    {
        public List<VendingMachine> GetAllVendingMachines()
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = "SELECT * FROM VendingMachines ORDER BY VendID ASC";
            using var cmd = new MySqlCommand(stm, con);
            // cmd.Prepare();
            using MySqlDataReader rdr = cmd.ExecuteReader();
            List<VendingMachine> AllVendingMachines = new List<VendingMachine>();
            while(rdr.Read())
            {
                AllVendingMachines.Add(new VendingMachine(){VendID = rdr.GetInt32(0), Address = rdr.GetString(1), ZipCode = rdr.GetInt32(2), Deleted = rdr.GetBoolean(3), AdminID = rdr.GetInt32(4)});
            }
            con.Close();
            return AllVendingMachines;
        }

        public void NewVendingMachine(VendingMachine myVendingMachine)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            Console.WriteLine("New Vending Machine");

            string stm = @"INSERT INTO VendingMachines (Address, ZipCode, Deleted, VendID) VALUES(@Address, @ZipCode, @Deleted, @VendID)";

            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@Address", myVendingMachine.Address);
            cmd.Parameters.AddWithValue("@ZipCode", myVendingMachine.ZipCode);
            cmd.Parameters.AddWithValue("@Deleted", myVendingMachine.Deleted);
            cmd.Parameters.AddWithValue("@VendID", myVendingMachine.VendID);

            cmd.Prepare();

            cmd.ExecuteNonQuery();
        }

        public void UpdateVendingMachine(VendingMachine value)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = @"UPDATE VendingMachines SET Address = @Address, ZipCode = @ZipCode, Deleted = @Deleted WHERE VendID = @ID";
            MySqlCommand cmd = new MySqlCommand(stm, con);
            
            cmd.Parameters.AddWithValue("@Address", value.Address);
            cmd.Parameters.AddWithValue("@ZipCode", value.ZipCode);
            cmd.Parameters.AddWithValue("@Deleted", value.Deleted);
            cmd.Parameters.AddWithValue("@ID", value.VendID);
            
            cmd.Prepare();
            cmd.ExecuteNonQuery();
            con.Close();
        }

        public void DeleteVendingMachine(VendingMachine value)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"UPDATE VendingMachines SET Deleted = 1 WHERE VendID = @id";

            using var cmd = new MySqlCommand(stm, con);
            cmd.Parameters.AddWithValue("@id", value.VendID);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}