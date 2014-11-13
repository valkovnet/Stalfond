using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uralsib.Stalfond.Direct.Helpers
{
    public static class StatusesHelper
    {
        public static Dictionary<string, string> GuidToOurStatusCode = new Dictionary<string, string>() 
        {
            {"1C0700C4-A109-4F07-A6EA-B6C7381E2AFE","New"},
            {"BE8B38C3-BE66-4F33-B530-EB682180745E","Draft"},
            {"C6E88880-E580-43F9-B2AB-095F8115D5E5","Saved"},
            {"D4063346-5532-4B06-BE35-3E323FD18A41","Printed"},
            {"0933CD5E-5F4F-45F6-9874-C590A5072618","OnCall"},
            {"5627F998-99D2-45A8-AF98-C8F8090F82C8","AdditionalCall"},
            {"7C60FCAA-4F94-4947-A36D-AB1BCA37DF27","FondReject"},
            {"87DBEFC3-3359-4F96-94F6-585B1259BB63","CallNotSuccesfull"},
            {"EEB5593C-302D-4B9E-B3D6-E72EA258D908","Successfull"},
            {"1423EC63-1C9C-4547-8322-8DA11B674BE1","Canceled"}
        };

        public static Dictionary<string, string> GuidToOurString = new Dictionary<string, string>() 
        {
            {"1C0700C4-A109-4F07-A6EA-B6C7381E2AFE","Новый"},
            {"BE8B38C3-BE66-4F33-B530-EB682180745E","Черновики"},
            {"C6E88880-E580-43F9-B2AB-095F8115D5E5","Заведенные"},
            {"D4063346-5532-4B06-BE35-3E323FD18A41","Напечатанные"},
            {"0933CD5E-5F4F-45F6-9874-C590A5072618","На обзвоне"},
            {"5627F998-99D2-45A8-AF98-C8F8090F82C8","Дополнительный звонок"},
            {"7C60FCAA-4F94-4947-A36D-AB1BCA37DF27","Отказ Фонда"},
            {"87DBEFC3-3359-4F96-94F6-585B1259BB63","Недозвон"},
            {"EEB5593C-302D-4B9E-B3D6-E72EA258D908","Успешный"},
            {"1423EC63-1C9C-4547-8322-8DA11B674BE1","Аннулированный"}
        };

        public static Dictionary<string, string> OurStatusCodeToGuid = new Dictionary<string, string>() 
        {
            {"New","1C0700C4-A109-4F07-A6EA-B6C7381E2AFE"},
            {"Draft","BE8B38C3-BE66-4F33-B530-EB682180745E"},
            {"Saved","C6E88880-E580-43F9-B2AB-095F8115D5E5"},
            {"Printed","D4063346-5532-4B06-BE35-3E323FD18A41"},
            {"OnCall","0933CD5E-5F4F-45F6-9874-C590A5072618"},
            {"AdditionalCall","5627F998-99D2-45A8-AF98-C8F8090F82C8"},
            {"FondReject","7C60FCAA-4F94-4947-A36D-AB1BCA37DF27"},
            {"CallNotSuccesfull","87DBEFC3-3359-4F96-94F6-585B1259BB63"},
            {"Successfull","EEB5593C-302D-4B9E-B3D6-E72EA258D908"},
            {"Canceled","1423EC63-1C9C-4547-8322-8DA11B674BE1"}
        };

        public static Dictionary<string, string> OurStringToGuid = new Dictionary<string, string>() 
        {
            {"Новый","1C0700C4-A109-4F07-A6EA-B6C7381E2AFE"},
            {"Черновики","BE8B38C3-BE66-4F33-B530-EB682180745E"},
            {"Заведенные","C6E88880-E580-43F9-B2AB-095F8115D5E5"},
            {"Напечатанные","D4063346-5532-4B06-BE35-3E323FD18A41"},
            {"На обзвоне","0933CD5E-5F4F-45F6-9874-C590A5072618"},
            {"Дополнительный звонок","5627F998-99D2-45A8-AF98-C8F8090F82C8"},
            {"Отказ Фонда","7C60FCAA-4F94-4947-A36D-AB1BCA37DF27"},
            {"Недозвон","87DBEFC3-3359-4F96-94F6-585B1259BB63"},
            {"Успешный","EEB5593C-302D-4B9E-B3D6-E72EA258D908"},
            {"Аннулированный","1423EC63-1C9C-4547-8322-8DA11B674BE1"}
        };

        public static Dictionary<string, string> OurStringToOurStatus = new Dictionary<string, string>() 
        {
            {"Новый","New"},
            {"Черновики","Draft"},
            {"Заведенные","Saved"},
            {"Напечатанные","Printed"},
            {"На обзвоне","OnCall"},
            {"Дополнительный звонок","AdditionalCall"},
            {"Отказ Фонда","FondReject"},
            {"Недозвон","CallNotSuccesfull"},
            {"Успешный","Successfull"},
            {"Аннулированный","Canceled"}
        };

        public static Dictionary<string, string> OurStringToCustomerString = new Dictionary<string, string>() 
        {
            {"Новый","Накопительный период"},
            {"Черновики","Ожидание поступления взносов"},
            {"Заведенные","Ожидание подтверждения ПФР"},
            {"Напечатанные","Выплатной период"},
            {"На обзвоне","Не подтвержден А"},
            {"Дополнительный звонок","Не подтвержден Б"},
            {"Отказ Фонда","Отказ фонда"},
            {"Недозвон","Недозвон"},
            {"Успешный","Заключен"},
            {"Аннулированный","NULL"}
        };


    }
}
