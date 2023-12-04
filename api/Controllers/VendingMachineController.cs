using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Utilities;


namespace api.Controllers
{
    [Route("api/[controller]", Name = "VendingMachineRoute")]
    [ApiController]
    public class VendingMachineController : ControllerBase
    {

        // GET: api/TTVM
        [HttpGet]
        public List<VendingMachine> Get()
        {
            VendingMachineUtilities utility = new VendingMachineUtilities();
            return utility.GetAllVendingMachines();
        }

        // GET: api/TTVM/5
        [HttpGet("{id}", Name = "GetVendingMachine")]
        public VendingMachine Get(int id)
        {
            VendingMachineUtilities utility = new VendingMachineUtilities();
            List<VendingMachine> myVendingMachines = utility.GetAllVendingMachines();

            foreach(VendingMachine vendingMachine in myVendingMachines)
            {
                if(vendingMachine.VendID == id)
                {
                    return vendingMachine;
                }
            }
            return new VendingMachine();
        }


        // POST: api/TTVM
        [HttpPost]
        public void Post([FromBody] VendingMachine value)
        {
            VendingMachineUtilities utility = new VendingMachineUtilities();
            utility.NewVendingMachine(value);
        }

        // PUT: api/TTVM/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] VendingMachine value)
        {
            VendingMachineUtilities utility = new VendingMachineUtilities();
            utility.UpdateVendingMachine(value);
        }

        // DELETE: api/TTVM/5
        [HttpDelete("{id}")]
        public void Delete(VendingMachine value)
        {
            VendingMachineUtilities utility = new VendingMachineUtilities();
            utility.DeleteVendingMachine(value);
        }
    }

   
}
