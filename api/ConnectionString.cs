namespace api
{
    public class ConnectionString
    {
        private string host {get; set;}
        private string database {get; set;}
        private string username {get; set;}
        private string port {get; set;}
        private string password {get; set;}

        public string cs {get; set;}

        public ConnectionString(){
        host = "lfmerukkeiac5y5w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
        database = "rd4krwq0x3bsyyiy";
        username = "t13m36baw9netfel";
        port = "3306";
        password = "n4mevv57npaxvssu";

        cs = $"server={host};user={username};database={database};port={port};password={password}";
        
        }
    }
}