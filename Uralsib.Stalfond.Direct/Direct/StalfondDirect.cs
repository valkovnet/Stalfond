using Ext.Direct;
using Newtonsoft.Json.Linq;
using System;
using Uralsib.Stalfond.Direct.Classes;
using Virtu.FFW;
using Virtu.Json.Policy;

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
        public JObject NewDocument(JObject document)
        {
            var res = new Result();
            try
            {
                //JsonHelper.SetJValue(document, "ProductID", "8B9D437D-2B55-488F-88B8-97683273E58A");
                //JsonHelper.SetJValue(document, "ID", new Random().Next(10000, 20000));

                //save here
                //PolicyStorage PS = new PolicyStorage(new FeatureBase());
                //var result = (JObject)PS.Update(document);

                res.success = true;
                res.message = "New doc created";
                res.docNumber = new Random().Next(10000, 20000);
                res.status = "Новый";
            }
            catch (Exception ex)
            {
                res.success = false;
                res.message = ex.Message;
            }

            return res.ToJObject();
        }

        [DirectMethod, ParseAsJson]
        public JObject SaveDocument(JObject document)
        {
            try
            {
                JsonHelper.SetJValue(document, "success", true);
                JsonHelper.SetJValue(document, "message", "Doc has been saved");
                if ((string)document["status"] == "Черновик" || (string)document["status"] == "Новый")
                {
                    JsonHelper.SetJValue(document, "status", "Заведенный");
                    JsonHelper.SetJValue(document, "statusText", "Заведенный");
                }
                JsonHelper.SetJValue(document, "ProductID", "8B9D437D-2B55-488F-88B8-97683273E58A");
                JsonHelper.SetJValue(document, "ID", new Random().Next(10000, 20000));

                //save here
                //PolicyStorage PS = new PolicyStorage(new FeatureBase());
                //var res = (JObject)PS.Update(document);
                // here we have some EXCEPTION!!

                //return res;

                return document;
            }
            catch (Exception ex)
            {
                JsonHelper.SetJValue(document, "success", false);
                JsonHelper.SetJValue(document, "message", ex.Message);
                return document;
            }
            
        }

        [DirectMethod, ParseAsJson]
        public JObject ChangeStatus(JObject document)
        {
            var res = new Result();
            try
            {
                res.success = true;
                res.message = "Status changed";
                res.status = Result.NextStatus[(string)document["status"]];

                return res.ToJObject();
            }
            catch (Exception ex)
            {
                JsonHelper.SetJValue(document, "success", false);
                JsonHelper.SetJValue(document, "message", ex.Message);
                return document;
            }

        }

    }
}
