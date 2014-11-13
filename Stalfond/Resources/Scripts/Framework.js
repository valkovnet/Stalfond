/// <reference name="MicrosoftAjax.js"/>
/// <reference path="~/Scripts/Ext/adapter/ext/ext-base.js"/>
/// <reference path="~/scripts/Ext/ext-all.js"/>

var quote = new Object(); // результат расчёта

var serverData; // данные полученные методом GetAllData

function profileRead(keyList, productId) {
    return framework.ReadData('/ProfileFeature/Profile', { 'keyList': keyList, 'object': productId });
}

function policyRead(policyId) {
    return framework.Execute('/JPolicyFeature/Read', { 'id': policyId });
}

function policyReadTemplate(productId, templateId) {
    return framework.Execute('/JPolicyFeature/ReadTemplate', { product_id: productId, template_id: templateId });
}
function PrintFormat(doc) {
    var newDoc = doc;
    // TODO надо допилить ядро чтобы можно было указать (н-р в профиле) кастомный формат сохранения дат
    newDoc.calcAge = toPrintableDate(doc.calcAge);
    newDoc.DocumentDate = toPrintableDate(doc.DocumentDate);

    newDoc.docInsurerBirthdate = toPrintableDate(doc.docInsurerBirthdate);
    newDoc.docInsurerPassDate = toPrintableDate(doc.docInsurerPassDate);
    newDoc.docInsuredBirthdate = toPrintableDate(doc.docInsuredBirthdate);
    newDoc.docInsuredPassDate = toPrintableDate(doc.docInsuredPassDate);

    newDoc.docInsurerVisaDateStart = toPrintableDate(doc.docInsurerVisaDateStart);
    newDoc.docInsurerVisaDateEnd = toPrintableDate(doc.docInsurerVisaDateEnd);
    newDoc.docInsuredVisaDateStart = toPrintableDate(doc.docInsuredVisaDateStart);
    newDoc.docInsuredVisaDateEnd = toPrintableDate(doc.docInsuredVisaDateEnd);

    newDoc.docInsurerMigrationDateStart = toPrintableDate(doc.docInsurerMigrationDateStart);
    newDoc.docInsurerMigrationDateEnd = toPrintableDate(doc.docInsurerMigrationDateEnd);
    newDoc.docInsuredMigrationDateStart = toPrintableDate(doc.docInsuredMigrationDateStart);
    newDoc.docInsuredMigrationDateEnd = toPrintableDate(doc.docInsuredMigrationDateEnd);

    newDoc.docPaymentDate = toPrintableDate(doc.docPaymentDate);
    newDoc.EffectiveDate = toPrintableDate(doc.EffectiveDate);
    newDoc.ExpirationDate = toPrintableDate(doc.ExpirationDate);

    for (var i = 0; newDoc.docBenSurvList[i] != undefined; i++) {
        var obj = newDoc.docBenSurvList[i];
        obj.docBenBirthdate = toPrintableDate(obj.docBenBirthdate);
        obj.docBenPassDate = toPrintableDate(obj.docBenPassDate);
        obj.docBenVisaDateStart = toPrintableDate(obj.docBenVisaDateStart);
        obj.docBenVisaDateEnd = toPrintableDate(obj.docBenVisaDateEnd);
        obj.docBenMigrationDateStart = toPrintableDate(obj.docBenMigrationDateStart);
        obj.docBenMigrationDateEnd = toPrintableDate(obj.docBenMigrationDateEnd);

    }
    for (var i = 0; newDoc.docBenDeathList[i] != undefined; i++) {
        var obj = newDoc.docBenDeathList[i];
        obj.docBenBirthdate = toPrintableDate(obj.docBenBirthdate);
        obj.docBenPassDate = toPrintableDate(obj.docBenPassDate);
        obj.docBenVisaDateStart = toPrintableDate(obj.docBenVisaDateStart);
        obj.docBenVisaDateEnd = toPrintableDate(obj.docBenVisaDateEnd);
        obj.docBenMigrationDateStart = toPrintableDate(obj.docBenMigrationDateStart);
        obj.docBenMigrationDateEnd = toPrintableDate(obj.docBenMigrationDateEnd);
    }


    newDoc.CurrencyRates = undefined;

    return newDoc;
}
function newguid() {

    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function PrintPolicy(viewID, noCache) {
    if (IsProject) { SavePolicy(); }

    var printableDoc = PrintFormat(doc);

    var policyKey = framework.Execute('/JPolicyFeature/Print', { 'policy': printableDoc, 'policyId': policyID }); // если полис новый, то Id будет сгенерирован в фиче
    window.open(printPageAddress + '?ProductID=' + productID.toUpperCase() + "&PolicyID=" + policyKey + '&View=' + viewID + "&NoCache=" + noCache + "&rnd=" + newguid(), '_blank', 'toolbar=1,location=0,width=800px,height=700px,resizable=1,scrollbars=1');
}
function invokeMeta(params) {
    showErrors([]);
    var result = null;
    try {
        result = framework.Execute('/UralSibCSFeature/UralSibCSMeta', { 'args': params });
    }
    catch (e) {
        showErrors([e.message]);
        return false;
    }
    if (result && result.Errors && result.Errors[0]) {
        showErrors(result.Errors, Ext.MessageBox.ERROR);
        return false;
    }
    return result;
}

function GetAllData() {

    try {
        serverData = framework.Execute('/ClientCardFeature/product/GetAllDataForQuote',
                {
                    "productId": productID,
                    "parentProductId": productID,
                    "templateId": "nothing",
                    "classifierList":
                        [
                            "AF82D74C-529A-4CFE-AF56-28C95390143E", "698FBAA3-621E-4663-A112-341749D3C7A1", "D53A97C6-2537-4A28-A4A5-6060953FDC70", "2D0D66F8-69AC-4F56-BAD6-3A358A0A37F5"
                        ],
                    "profileList":
                        [
                        'policyMinSum', 'policyMaxSum', 'thrustValue',
                        'policyMinDuration', 'policyMaxDuration',
                        'policyMinAge', 'policyMaxAge',
                        'policyMaxBen', 'policyShare',
                        'uwRecipient',
                        'PrintedFormPath',
                        'UploadTool', 'scanner', 'calcCurrencyAllow',
                        'riskAccidentDeath', 'riskInjuries', 'riskAccidentHospital', 'riskSOSZHV', 'riskInvalid1', 'riskInvalid2', 'riskInvalid3',
                        'warrantyDate', 'warrantyNumber', 'proposalFullName', 'proposalPhone',
                        'broker', 'author', 'salesPoint', 'curator', 'creditOrganization', 'salesChannel', 'specials',
                        'office', 'filial', 'filialCode', 'salesChannelCode', 'regionBoss', 'cluster', 'tabnumber'

                        ],
                    "tarifList":
                        [

                        ],
                    "decodeClassified": true,
                    "getViewList": true,
                    "getTemplateList": true,
                    "getLoginInformation": true
                }, undefined);

        InitProfile(JSON.parse(serverData.profileList));

        profStore = classifierStore(serverData, "2D0D66F8-69AC-4F56-BAD6-3A358A0A37F5", false, undefined);
        documentStore = classifierStore(serverData, "AF82D74C-529A-4CFE-AF56-28C95390143E", false, undefined);
        documentStore2 = classifierStore(serverData, "AF82D74C-529A-4CFE-AF56-28C95390143E", false, undefined);

        documentStore2.unshift(["76287A37-ADB9-4933-A78A-1E21B573B8A9", 'Свидетельство о рождении']);

        visaStore = classifierStore(serverData, "D53A97C6-2537-4A28-A4A5-6060953FDC70", false, undefined);
        durationStore = c_durationStore(minDuration, maxDuration);
        fundStore = classifierStore(serverData, "698FBAA3-621E-4663-A112-341749D3C7A1", false, undefined);

        accStore = c_durationStore(2, 30);
        payoutStore = c_durationStore(4, 6);


        titleForm = Enumerable.From(JSON.parse(serverData.productList)).First("a=> a.ID.toLowerCase() == productID.toLowerCase()").Name;
    }
    catch (e) {

        showErrors([e.message], Ext.MessageBox.ERROR, 'Система');
        //Ext.Msg.alert('Произошла ошибка', e.message);
    }

}

function InitPrintedForms(printedForms, menu) {
    //    printedForms.push(new Object({ Text: "Условия", Key: 'terms.mrt', NoAccept: true }));
    //    printedForms.push(new Object({ Text: "Заявление", Key: 'request.mrt', NoAccept: true, NoCache: true }));
    //    printedForms.push(new Object({ Text: "Анкета о состоянии здоровья", Key: 'formHealth.pdf', NoAccept: true }));
    //    printedForms.push(new Object({ Text: "Анкета Физ. лица", Key: 'formIndividual.pdf', NoAccept: true }));
    //    printedForms.push(new Object({ Text: "Анкета о фин. положении", Key: 'formFinance.pdf', NoAccept: true }));
    //    printedForms.push(new Object({ Text: "Форма мед. обследования", Key: 'formMedical.pdf', NoAccept: true }));
    //    printedForms.push(new Object({ Text: "Перечень СОЗ", Key: 'listSOZ.mrt', NoAccept: true }));
    //    printedForms.push(new Object({ Text: "Таблица размеров страховых выплат", Key: 'tableInjuries.mrt', NoAccept: true }));
    var buttonId = menu + "aPrint";
    if (printedForms != null && printedForms[0] != null) {
        Ext.getCmp(buttonId).setHandler(null);
        for (var pri = 0; printedForms[pri] != null; pri++) {
            Ext.getCmp(buttonId).initialConfig.menu.addItem(new Ext.Action({
                id: buttonId + printedForms[pri].Key,
                viewId: printedForms[pri].Key,
                noCache: true, //  printedForms[pri].NoCache
                noAccept: true, /* Все могут печататься */ // printedForms[pri].NoAccept,
                text: printedForms[pri].Text || printedForms[pri].Value.Caption,
                handler: function () {
                    if (!IsAccepted && !this.noAccept) {
                        showErrors(['Полис не акцептован.'], Ext.MessageBox.WARNING);
                        return;
                    }

                    PrintPolicy(this.viewId, this.noCache);

                },
                iconCls: 'print16'
            }));
        }
        ;
    } else {
        Ext.getCmp(buttonId).initialConfig.menu.destroy();
    }
}


function InitTemplates(templates, menu) {
    if (templates != null) {
        if (templates[0] != null) {
            for (var pri = 1; templates[pri - 1] != null; pri++) {
                Ext.getCmp(menu + 'aNew').initialConfig.menu.addItem(new Ext.Action({
                    id: templates[pri - 1].Key,
                    text: templates[pri - 1].Value.Caption,
                    handler: function () {
                        NewPolicyUrl(policyUrl + "?ProductID=" + windowParams.ProductID + "&TemplateID=" + this.id);
                    },
                    iconCls: 'temp16'
                }));
            }
        }
    }
}

function GetFormObject(frm) {

    if (Ext.getCmp("riskInvalid1").getValue())
        CopyInsurer2();

    var obj = formToObject(frm);

    obj.TemplateID = templateID;
    obj.ProductID = productID;
    obj.ID = policyID;
    obj.DocumentStatusID = doc.DocumentStatusID;
    // Результаты пред расчёта
    obj.ProfValues = doc.ProfValues || PolicyOptions;
    obj.LoginInformation = loginInformation;
    obj.UserInfo = userInfo;
    obj.Quote = quote;

    obj.CreatorUser = obj.CreatorUser || doc.CreatorUser;
    obj.CreatorName = obj.CreatorName || doc.CreatorName;
    obj.InsurerRepresentId = obj.InsurerRepresentId || doc.InsurerRepresentId;
    obj.InsurerRepresentName = obj.InsurerRepresentName || doc.InsurerRepresentName;
    obj.FilialName = obj.FilialName || doc.FilialName;
    obj.SallerDivisionID = obj.SallerDivisionID || doc.SallerDivisionID;
    obj.SallerDivision = obj.SallerDivision || doc.SallerDivision;
    obj.ProductName = obj.ProductName || doc.ProductName;

    obj.DocumentDate = obj.DocumentDate || dateToStr(new Date());
    obj.docPaymentDate = obj.docPaymentDate || dateToStr(new Date());

    if (IsProject) {
        obj.CurrencyRates = CurrencyRates;
    }

    return obj;
}


function WritePolicy(status) {

    IsNew = false;
    IsCopy = !status;
    if (templateID) {
        // Обновляем template
        doc.DocumentDate = undefined;
        return framework.Execute('/JPolicyFeature/UpdateTemplate', { 'product_id': productID, 'template_id': templateID, 'template_body': doc });
    }

    if (IsCopy) status = 'CA791971-3028-47BD-8C49-94582E21F6B8';

    // статус полиса
    doc.DocumentStatusID = status;

    if (!IsCopy)
        doc = framework.Execute('/JPolicyFeature/Update', { 'data': doc });

    IsProject = status == 'CA791971-3028-47BD-8C49-94582E21F6B8';
    IsAccepted = status == '0C9468DD-F53C-4962-8B0B-93BF28ABA6A9';
    IsAnnulated = status == 'FFE17B47-6238-4DFD-B3ED-FCA4104A39EE';
    IsPaid = status == 'C9DD9941-17EF-4326-BBD8-AA32A5E04186';
    IsFinished = status == 'AE59D23F-B9A2-440E-9845-D570F6056761';
    IsEffective = status == '9152AF35-3034-42FE-ABCA-458C786689F8';

    // обновление IDшников
    policyID = doc.ID;
    productID = doc.ProductID;

    window.location.hash = "PolicyID=" + policyID;

    return doc;
}

function GetStatusName() {
    if (IsProject) return "Проект";
    if (IsAccepted) return "Акцептован";
    if (IsAnnulated) return "Аннулирован";
    if (IsPaid) return "Оплачен";
    if (IsFinished) return "Завершен";
    if (IsEffective) return "Действующий";
    return "";
}

function InitProfile(policyOptions) {
    //читаем профиль
    PolicyOptions = policyOptions;
    var profileError = false;

    var profValueOrDefault = function (prof, defaultValue, throwError) {
        if (policyOptions[prof] === undefined || policyOptions[prof] === null || policyOptions[prof] === '') {
            if (throwError) {
                profileError = true;
            }
            return defaultValue;
        }
        return policyOptions[prof];
    };

    minDuration = profValueOrDefault('policyMinDuration', 1);
    maxDuration = profValueOrDefault('policyMaxDuration', 17);
    minAge = profValueOrDefault('policyMinAge', 18);
    maxAge = profValueOrDefault('policyMaxAge', 69);
    // TODO minChildAge = profValueOrDefault('policyChildMinAge', 17);
    // TODO maxChildAge = profValueOrDefault('policyChildMaxAge', 1);
    minAgeDate = new Date().format((new Date().getFullYear() - maxAge) + '-m-d');
    maxAgeDate = new Date().format((new Date().getFullYear() - minAge) + '-m-d');
    minAgeChildDate = new Date().format((new Date().add(Date.DAY, -1).getFullYear() - 17) + '-m-d');
    maxAgeChildDate = new Date().format((new Date().add(Date.DAY, -1).getFullYear() - 1) + '-m-d');
    minSum = profValueOrDefault('policyMinSum', undefined);
    maxSum = profValueOrDefault('policyMaxSum', undefined);
    maxBen = profValueOrDefault('policyMaxBen', 3);
    scanner = profValueOrDefault('scanner', undefined);
    uploadTool = profValueOrDefault("UploadTool", undefined);
    calcCurrencyAllow = profValueOrDefault("calcCurrencyAllow", undefined);
    riskAccidentDeath = profValueOrDefault('riskAccidentDeath', true); //  	Инвалидность Застрахованного лица (ребенок-инвалид)   
    riskInjuries = profValueOrDefault('riskInjuries', true);
    riskAccidentHospital = profValueOrDefault('riskAccidentHospital', true); //  	Инвалидность Застрахованного лица (ребенок-инвалид)   
    riskSOSZHV = false; //profValueOrDefault('riskSOSZHV', true);
    riskInvalid1 = profValueOrDefault('riskInvalid1', true);
    riskInvalid2 = false; // profValueOrDefault('riskInvalid2', true);
    riskInvalid3 = false; //profValueOrDefault('riskInvalid3', true);
    uwRecipient = profValueOrDefault('uwRecipient', undefined); // получатель письма на андерайтинг

    SalesPointBroker = profValueOrDefault('broker', undefined, true);
    SalesPointCurator = profValueOrDefault('curator', undefined, true);
    SalesPointCreditOrganization = profValueOrDefault('creditOrganization', undefined);
    SalesPointSalesChannel = profValueOrDefault('salesChannel', undefined, true);
    SalesPointSpecials = profValueOrDefault('specials', undefined);
    SalesPointSalesPoint = profValueOrDefault('author', undefined, true);
    SalesPointAuthor = profValueOrDefault('salesPoint', undefined, true);

    profValueOrDefault('regionBoss', undefined, true);
    profValueOrDefault('cluster', undefined, false);
    profValueOrDefault('salesChannelCode', undefined, true);
    profValueOrDefault('filialCode', undefined, true);
    profValueOrDefault('filial', undefined, true);
    profValueOrDefault('office', undefined, true);



    IsProfileValid = !profileError;
}

function LoadPolicy() {
    // загрузка полиса
    ReadPolicy();
    // подгрузка всех данных
    GetAllData();
}

function ReadPolicy() {

    if (policyID) {
        doc = policyRead(policyID);
    }
    if (templateID || !doc) {
        doc = policyReadTemplate(productID, templateID);
        doc.ExpirationDate = new Date();
    }

    productID = doc.ProductID;

    IsProject = doc.DocumentStatusID == 'CA791971-3028-47BD-8C49-94582E21F6B8';
    IsAccepted = doc.DocumentStatusID == '0C9468DD-F53C-4962-8B0B-93BF28ABA6A9';
    IsAnnulated = doc.DocumentStatusID == 'FFE17B47-6238-4DFD-B3ED-FCA4104A39EE';

    IsPaid = doc.DocumentStatusID == 'C9DD9941-17EF-4326-BBD8-AA32A5E04186';
    IsFinished = doc.DocumentStatusID == 'AE59D23F-B9A2-440E-9845-D570F6056761';
    IsEffective = doc.DocumentStatusID == '9152AF35-3034-42FE-ABCA-458C786689F8';

    quote = doc.Quote;

    if (!IsProject) {
        CurrencyRates = doc.CurrencyRates;
    }
}

function BindPolicy() {

    IsLoading = true;

    try {

        var templates = JSON.parse(serverData.templateList);

        InitTemplates(templates, 'mainmenu1');

        InitTemplates(templates, 'mainmenu2');

        var printedForms = JSON.parse(serverData.viewList);

        InitPrintedForms(printedForms, 'mainmenu1');

        InitPrintedForms(printedForms, 'mainmenu2');

        loginInformation = eval("(" + serverData.loginInformation + ")");

        doc.DocumentDate = doc.DocumentDate || dateToStr(new Date());

        bindStores(serverData, formMain);

        objectToForm(doc, formMain);

        ApplyStatus(doc);

    } finally {
        IsLoading = false;
    }


}

function NewPolicyUrl(urlAddress) {
    location.href = urlAddress;
}


function UpdateDates() {
    doc.docPaymentDate = doc.docPaymentDate || dateToStr(new Date());
    doc.DocumentDate = doc.DocumentDate || dateToStr(new Date());
    doc.EffectiveDate = dateToStr(Date.parseDate(doc.docPaymentDate, "Y-m-d").add(Date.DAY, 1));
    doc.ExpirationDate = dateToStr(Date.parseDate(doc.EffectiveDate, "Y-m-d").add(Date.YEAR, parseInt(Ext.getCmp('calcDuration').getValue() || 0)).add(Date.DAY, -1));
}


function SavePolicy() {

    showErrors([]);

    if (!policyID) policyID = newGUID();

    doc = GetFormObject(formMain);

    doc.InsuredName = Ext.getCmp('docInsurerSecond').getValue() + ' ' + Ext.getCmp('docInsurerFirst').getValue() + ' ' + Ext.getCmp('docInsurerThird').getValue();

    doc.AcceptationDate = undefined;

    UpdateDates();

    doc = WritePolicy('CA791971-3028-47BD-8C49-94582E21F6B8');

    objectToForm(doc, formMain);

    ApplyStatus(doc);

}

function AcceptPolicy() {

    showErrors([]);

    if (!policyID) policyID = newGUID();

    if (!CalculatePolicy()) return;

    Ext.getCmp('tabpanel001').setActiveTab(0);

    doc = GetFormObject(formMain);

    doc.InsuredName = Ext.getCmp('docInsurerSecond').getValue() + ' ' + Ext.getCmp('docInsurerFirst').getValue() + ' ' + Ext.getCmp('docInsurerThird').getValue();

    doc.AcceptationDate = dateToStr(new Date());

    UpdateDates();

    doc = WritePolicy('0C9468DD-F53C-4962-8B0B-93BF28ABA6A9');

    objectToForm(doc, formMain);

    ApplyStatus(doc);
}

function CopyPolicy() {

    showErrors([]);

    doc = GetFormObject(formMain);

    doc.ID = newGUID();

    doc.InsuredName = Ext.getCmp('docInsurerSecond').getValue() + ' ' + Ext.getCmp('docInsurerFirst').getValue() + ' ' + Ext.getCmp('docInsurerThird').getValue();

    doc.AcceptationDate = undefined;
    doc.DocumentDate = undefined;
    doc.docPaymentDate = undefined;

    UpdateDates();

    doc.SERIAL = undefined;
    doc.NUMBER = undefined;

    Ext.getCmp('SERIAL').setValue(undefined);
    Ext.getCmp('NUMBER').setValue(undefined);

    doc.ProfValues = undefined;

    doc.CreatorName = undefined;
    doc.CreatorUser = undefined;
    doc.SallerDivisionID = undefined;
    doc.SallerDivision = undefined;

    doc = WritePolicy(); // страница не перезагружается   

    objectToForm(doc, formMain);

    ApplyStatus(doc);

    //NewPolicyUrl(policyUrl + "?ProductID=" + productID + "&PolicyID=" + policyID);
}

function DeletePolicy() {

    doc = GetFormObject(formMain);

    UpdateDates();

    doc = WritePolicy('FFE17B47-6238-4DFD-B3ED-FCA4104A39EE');

    objectToForm(doc, formMain);

    ApplyStatus(doc);
}

function WritePolicyStatus(policy, status) {
    try {
        var doc = invokeMeta(new Object({ cmd: 2, policy: policy, status: status }));
        return doc;
    } catch (e) { }

}

function FinishPolicy() {

    showErrors([]);

    doc = WritePolicy('AE59D23F-B9A2-440E-9845-D570F6056761');

    objectToForm(doc, formMain);

    ApplyStatus(doc);
}

function CalculatePolicy() {
    if (templateID) return true; // расчёт не может быть произведёsaн в режиме template
    showErrors([]); // очистка ошибок
    UpdateQuote();
    var calcObj = GetFormObject(formCalc);
    var result = null;
    try {
        result = framework.Execute('/UralSibCSFeature/UralSibDSCalculate', { 'policy': calcObj });
    }
    catch (e) {
        showErrors([e.message], Ext.MessageBox.ERROR);
        return false;
    }
    if (result && result.Errors && result.Errors[0]) {
        showErrors(result.Errors, Ext.MessageBox.WARNING);
        return false;
    }

    UpdateQuote(result); // результат расчёта

    return true;
}

function UpdateQuote(result, sender) {
    if (!result) {
        result = new Object();
    }

    Ext.getCmp('PremiumText').setValue(result.PremiumText);
    Ext.getCmp('calcPremium').setValue(result.Premium);
    Ext.getCmp('calcPremiumLife').setValue(result.PremiumLife);
    Ext.getCmp('calcPremiumNonLife').setValue(result.PremiumNonLife);
    Ext.getCmp('calcPayment').setValue(result.Payment);
    Ext.getCmp('calcPaymentRaw').setValue(result.PaymentRaw);
    Ext.getCmp('calcPaymentCount').setValue(result.PaymentCount);
    Ext.getCmp('calcPremiumRUR').setValue(result.PremiumRUR); //     

    quote = result;
}


function RequiestUW() {
    if (!uwRecipient) {
        showErrors(['В вашем профиле продукта не указан контакт андеррайтера.'], Ext.MessageBox.WARNING);
        return;
    }
    if (!IsUWSent) IsUWSent = SendUWEmail(uwRecipient);
    showErrors(['Сообщение ' + (IsUWSent ? "успешно отправлено!" : "не возможно отправить. Повторите попытку позже.")], Ext.MessageBox.WARNING);
}

function SendUWEmail(recipient) {
    if (!recipient) return;
    var emailSent = false;
    try {
        var doc = GetFormObject(formMain);
        var body_info = 'Отправитель: ' + userInfo.FullName + '\n';
        body_info += '\nСсылка на полис: ' + document.location.protocol + '//' + document.location.host + '/dispatchPage.aspx?PolicyId=' + policyID;
        emailSent = framework.Execute('/UralSibCSFeature/UralSibMail', { 'policy': doc, 'Subject': 'Заявка на андеррайтинг полиса', 'MailTo': recipient, 'documentList': [], 'body': body_info });
    }
    catch (e) { }
    return emailSent;
}

function getEffectiveDate(paymentDate) {
    if (!paymentDate) {
        paymentDate = new Date();
    }
    else {
        paymentDate = Date.parseInvariant(paymentDate, 'yyyy-MM-dd');
    }
    var tmpDate = new Date(paymentDate.setDate(paymentDate.getDate() + 1));
    return dateToStr(tmpDate);
}
