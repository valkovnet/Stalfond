using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uralsib.Stalfond.Direct.Classes
{
    public class Result
    {
        
        public bool success = false;
        public string message = "";

        public string status;
        public string statusText;

        public int docNumber;

        public JObject ToJObject()
        {
            var res = new JObject();

            res.Add("success", new JValue(this.success));
            res.Add("message", new JValue(this.message));
            res.Add("status", new JValue(this.status));
            res.Add("statusText", new JValue(this.status));
            res.Add("docNumber", new JValue(this.docNumber));


            return res;
        }

        public static Dictionary<string, string> NextStatus = new Dictionary<string,string>()
        {
            {"Новый", "Черновик"},
            {"Заведенный", "Напечатанный"},
            {"Черновик", "Напечатанный"},
            {"Напечатанный", "На обзвоне"}
        };
    }
}
