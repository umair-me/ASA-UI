using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WEB.API.Models;

namespace WEB.API.Controllers
{
    public class UserController : ApiController
    {
        User[] users = new User[]
        {
            new Models.User {ID=1, Name="Sat", Age=10, JoiningDate=DateTime.Parse(DateTime.Today.ToString()) },
            new Models.User {ID=2, Name="Test", Age=11, JoiningDate=DateTime.Parse(DateTime.Today.ToString()) }
        };
        public IEnumerable<User> GetAllUsers()
        {
            return users;
        }
        public IHttpActionResult GetUser(int id)
        {
            var user = users.FirstOrDefault(u => u.ID == id);
            if(user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
    }
}
