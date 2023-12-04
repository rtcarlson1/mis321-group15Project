using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Utilities;
using Microsoft.AspNetCore.Cors;


namespace api.Controllers
{
    [Route("api/[controller]", Name = "ProductRoute")]
    [ApiController]
    public class ProductController : ControllerBase
    {

        // GET: api/TTVM
        [HttpGet]
        public List<Product> Get()
        {
            ProductUtilities utility = new ProductUtilities();
            return utility.GetAllProducts();
        }

        // GET: api/TTVM/5
        [HttpGet("{id}", Name = "GetProduct")]
        public Product Get(int id)
        {
        ProductUtilities utility = new ProductUtilities();
        List<Product> myProducts = utility.GetAllProducts();
            foreach (Product product in myProducts)
            {
             if (product.ProductID == id)
                {
                    return product;
                }
            }
        return new Product();
}

        // POST: api/TTVM
        [HttpPost]
        public void Post([FromBody] Product value)
        {
            ProductUtilities utility = new ProductUtilities();
            utility.CreateProduct(value);
        }

        // PUT: api/TTVM/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Product value)
        {
            ProductUtilities utility = new ProductUtilities();
            utility.UpdateProduct(value);
        }

        // DELETE: api/TTVM/5
        [HttpDelete("{id}")]
        public void Delete(Product value)
        {
            ProductUtilities utility = new ProductUtilities();
            utility.DeleteProduct(value);
        }
    }

   
}
