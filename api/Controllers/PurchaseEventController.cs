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
    [Route("api/[controller]", Name = "PurchaseEventRoute")]
    [ApiController]
    public class PurchaseEventController : ControllerBase
    {

        // GET: api/TTVM
        [HttpGet]

        public List<PurchaseEvent> Get()
        {
            PurchaseEventUtilities utility = new PurchaseEventUtilities();
            return utility.GetAllPurchaseEvents();
        }

        // GET: api/TTVM/5
        [HttpGet("{id}", Name = "GetPurchaseEvent")]
        public PurchaseEvent Get(int id)
        {
            PurchaseEventUtilities utility = new PurchaseEventUtilities();
            List<PurchaseEvent> myPurchaseEvents = utility.GetAllPurchaseEvents();
            foreach(PurchaseEvent purchaseEvent in myPurchaseEvents)
            {
                if(purchaseEvent.PurchaseID == id)
                {
                    return purchaseEvent;
                }
            }
            return new PurchaseEvent();
        }

        // POST: api/TTVM
        [HttpPost]
        public void Post([FromBody] PurchaseEvent value)
        {
            PurchaseEventUtilities utility = new PurchaseEventUtilities();
            utility.NewPurchaseEvent(value);
        }

        // PUT: api/TTVM/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] PurchaseEvent value)
        {
            PurchaseEventUtilities utility = new PurchaseEventUtilities();
            utility.UpdatePurchaseEvent(value);
        }

        // DELETE: api/TTVM/5
        [HttpDelete("{id}")]
        public void Delete(PurchaseEvent value)
        {
            PurchaseEventUtilities utility = new PurchaseEventUtilities();
            utility.DeletePurchaseEvent(value);
        }
    }

   
}
