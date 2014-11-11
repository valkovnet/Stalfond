using Ext.Direct;
using Newtonsoft.Json.Linq;
using System;
using Uralsib.Stalfond.Direct.Classes;

namespace Uralsib.Stalfond.Direct.Direct
{
    [DirectAction("StalfondDirect")]
    public class StalfondDirect : DirectHandler
    {
        #region Configure Direct

        private const string ProviderNameConst = "VLib.API.Stalfond";
        private const string NamespaceConst = "VLib.API";


        public override string ProviderName
        {
            get { return ProviderNameConst; }
        }

        public override string Namespace
        {
            get { return NamespaceConst; }
        }

        #endregion

        [DirectMethod, ParseAsJson]
        public JObject CreateDocument(JObject document)
        {
            var res = new Result();
            try
            {
                res.success = true;
                res.documentId = new Random().Next(10000, 20000);
                res.status = "Заведенный";
            }
            catch (Exception ex)
            {
                res.success = false;
                res.message = ex.Message;
            }

            return res.ToJObject();
        }

    }
}
