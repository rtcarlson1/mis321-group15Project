using api.Models;
using System.Data;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Runtime.InteropServices;
using api.Controllers;

namespace api.Utilities
{
    public class AdminUtilities
    {
        public List<Admin> GetAllAdmins()
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = "SELECT * FROM Admins ORDER BY AdminID ASC";
            using var cmd = new MySqlCommand(stm, con);
            MySqlDataReader rdr = cmd.ExecuteReader();
            List<Admin> Alladmins = new List<Admin>();
            while(rdr.Read())
            {
                Alladmins.Add(new Admin(){AdminID = rdr.GetInt32(0), Email = rdr.GetString(1), Password = rdr.GetString(2), Deleted = rdr.GetBoolean(3)});
            }
            con.Close();
            return Alladmins;
        }

        public void CreateAdmin(Admin myAdmin)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs  = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();
            Console.WriteLine("New Admin");

            string stm = @"INSERT INTO Admins(Email, Password, Deleted) VALUES(@Email, @Password, @Deleted)";

            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@Email", myAdmin.Email);
            cmd.Parameters.AddWithValue("@Password", myAdmin.Password);
            cmd.Parameters.AddWithValue("@Deleted", myAdmin.Deleted);

            cmd.Prepare();

            cmd.ExecuteNonQuery();
            // throw new NotImplementedException();
        }

        public void UpdateAdmin(Admin value)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs = myConnection.cs;

            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = "UPDATE Admins";
            using var cmd = new MySqlCommand(stm, con);

            cmd.CommandText = @"UPDATE Admins SET Email = @Email, Password = @Password Where AdminID = @AdminID";

            cmd.Parameters.AddWithValue("@AdminID", value.AdminID);
            cmd.Parameters.AddWithValue("@Email", value.Email);
            cmd.Parameters.AddWithValue("@Password", value.Password);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }


       
        public void DeleteAdmin(Admin value)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"UPDATE Admins SET Deleted = 1 WHERE AdminID = @id";

            using var cmd = new MySqlCommand(stm, con);
            cmd.Parameters.AddWithValue("@id", value.AdminID);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    
    }
}