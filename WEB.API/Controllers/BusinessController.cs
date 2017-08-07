using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Xml.Linq;
using WEB.API.Models;
using System.Runtime.Serialization;
using System.Reflection;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using System.Web.Script.Serialization;
using Newtonsoft.Json.Linq;

namespace WEB.API.Controllers
{
    [EnableCors(origins: "http://localhost:55934/api/business", headers: "*", methods: "*")]
    public class BusinessController : ApiController
    {
        businessvm[] bu = new businessvm[]
        {
            new businessvm {Name="asa", TName="ttt", vatregnumber="VAT123", Id=1 }
        };

        public IEnumerable<businessvm> GetBusinessInfo()
        {
            return bu;
        }
        public IHttpActionResult GetBu(int id)
        {
            var buinf = bu.FirstOrDefault(p => p.Id == id);
            if(buinf==null)
            {
                return NotFound();
            }
            return Ok(buinf);
        }


        [HttpPost]
        public HttpResponseMessage Post([FromBody]JObject data)
        {
            //businessvm vm = new businessvm();
            if(data != null)
            {
                //businessvm vm = new businessvm();
                businessvm bvm = data["businessvm"].ToObject<businessvm>();
                //businessvm obj = new JavaScriptSerializer().Deserialize<businessvm>(busStr);
                // ServiceManager svr = new ServiceManager();
                var xdoc = new XDocument();//svr.SaveUserProfile(bvm);
                if (xdoc != null)
                    return new HttpResponseMessage()
                    {
                        Content = new StringContent(xdoc.ToString(), Encoding.UTF8, "application/xml")
                    };
            }
            return null;
        }
       
    }

    
    
}
