using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uralsib.Stalfond.Direct.Classes
{
    public class Result
    {
        public int documentId;
        public string status;
        public bool success = false;
        public string message = "";

        public JObject ToJObject()
        {
            var res = new JObject();
            res.Add("success", new JValue(success));
            res.Add("message", new JValue(message));
            res.Add("documentId", new JValue(documentId));
            res.Add("status", new JValue(status));
            return res;
        }
    }
}
