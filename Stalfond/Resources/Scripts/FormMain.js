/// <reference name="MicrosoftAjax.js"/>
/// <reference path="~/Scripts/Ext/adapter/ext/ext-base.js"/>
/// <reference path="~/scripts/Ext/ext-all.js"/>

var doc;
var policyID;
var productID;

var defaultProductID = "3954CAFA-4A9D-4E3B-9944-46F186638E0B";

// статус полиса
var IsProject;
var IsAccepted;
var IsAnnulated;
// новые статусы
var IsPaid;
// Оплачен
var IsEffective;
// Действующий
var IsFinished;
// Завершен

var IsProfileValid;
var IsAdmin;
var IsUnderwriter;
var IsCorrector;
var IsUWSent;
// андерайтинг успешно запрошен
var IsNew;

//var errormessage = 'Не заполнены все обязательные поля или содержащаяся в них информация не соответствует ограничениям!<br>Для уточнения, наведите курсор на поля отмеченные красной рамкой.';
//var errorCalc = 'На форме расчёта не заполнены все обязательные поля или содержащаяся в них информация не соответствует ограничениям!';
//var errorPolicy = 'На форме полиса не заполнены все обязательные поля или содержащаяся в них информация не соответствует ограничениям!';
var titleForm = 'Детский Стандарт';

var formCalc;
var formPolicy;
var formPayment;
var formMain;
var formDocuments;

var loginInformation;
var PolicyOptions;
var scValidationFlag;
// валидация сценария
var scenario;

//
var CreatorName_;
var CreatorLogin_;
var SalerDiv_;
var SalerDivId_;

var IsLoading;

function SetInfo(_CreatName, _CreatorLogin, _SalerDiv, _SalerDivId) {

    CreatorName_ = _CreatName;
    CreatorLogin_ = _CreatorLogin;
    SalerDiv_ = _SalerDiv;
    SalerDivId_ = _SalerDivId;

}

function initForm() {

    //IsCorrector = true;
    //IsUnderwriter = false;

    Ext.apply(Ext.form.TextField.prototype, {
        minLengthText: "Минимальное количество символов - {0}",
        maxLengthText: "Максимальное количество символов - {0}",
        blankText: "Это поле обязательно для заполнения",
        regexText: "",
        emptyText: null
    });

    function validateDocs(sc) {
        if (!scanner) return [];
        // Проверка требуемых документов
        var requiredDocs = [];
        if (sc >= 2) {

            var sum = parseInt((Ext.getCmp('calcPaymentRaw').getValue() || 1)) / 1000;
            var age = getAge(Ext.getCmp('docInsured2Birthdate').getValue());
            var doc = Ext.getCmp('docTOS').getValue();

            if (((sum < 1500 && age >= 18 && age < 50) || (age >= 50 && age < 55 && sum < 1000) || (age >= 55 && age < 69)) && !doc) {
                requiredDocs = [];
                requiredDocs.push(['20DFDC13-79CA-4B43-BAD5-21C31E87B32A', 'Декларация Доп.застрахованного лица']);
            }

            if ((sum > 1000 && sum <= 2500 && age >= 18 && age < 50) || (age >= 50 && age < 55 && sum > 1000 && sum <= 1500) || (sum < 750 && age >= 55 && age < 69)) {
                requiredDocs = [];
                requiredDocs.push(['D40C4CDA-BE51-4F5C-89B6-46C5A6A65D8B', 'Письменное заявление Страхователя']);
                requiredDocs.push(['C1148B1B-2217-4C5C-B19E-829F748F265D', 'Анкета о состоянии здоровья Доп.застрахованного лица']);
            }

            if ((sum > 2500 && sum <= 3500 && age >= 18 && age < 50) || (age >= 50 && age < 55 && sum > 1500 && sum <= 2500) || (sum > 750 && sum < 1500 && age >= 55 && age < 69)) {
                requiredDocs = [];
                requiredDocs.push(['D40C4CDA-BE51-4F5C-89B6-46C5A6A65D8B', 'Письменное заявление Страхователя']);
                requiredDocs.push(['C1148B1B-2217-4C5C-B19E-829F748F265D', 'Анкета о состоянии здоровья Доп.застрахованного лица']);
                requiredDocs.push(['931D6F78-3EFE-460F-8072-C3090741BD1A', 'Форма медицинского обследования']);
            }


            if ((sum > 3500 && sum <= 5000 && age >= 18 && age < 50) || (age >= 50 && age < 55 && sum > 2500 && sum <= 3500) || (sum > 1500 && sum <= 2500 && age >= 55 && age < 69)) {
                requiredDocs = [];
                requiredDocs.push(['D40C4CDA-BE51-4F5C-89B6-46C5A6A65D8B', 'Письменное заявление Страхователя']);
                requiredDocs.push(['C1148B1B-2217-4C5C-B19E-829F748F265D', 'Анкета о состоянии здоровья Доп.застрахованного лица']);
                requiredDocs.push(['931D6F78-3EFE-460F-8072-C3090741BD1A', 'Форма медицинского обследования + ЭКГ с прекордиальными отведениями в покое']);
            }


            if ((sum > 5000 && sum < 6000 && age >= 18 && age < 50) || (age >= 50 && age < 55 && sum > 3500 && sum < 5000) || (sum > 2500 && sum < 3500 && age >= 55 && age < 69)) {
                requiredDocs = [];
                requiredDocs.push(['D40C4CDA-BE51-4F5C-89B6-46C5A6A65D8B', 'Письменное заявление Страхователя']);
                requiredDocs.push(['C1148B1B-2217-4C5C-B19E-829F748F265D', 'Анкета о состоянии здоровья Доп.застрахованного лица']);
                requiredDocs.push(['931D6F78-3EFE-460F-8072-C3090741BD1A', 'Форма медицинского обследования + ЭКГ с прекордиальными отведениями в покое + Клинический и биохимический анализы крови']);
            }

            if ((sum > 6000 && age >= 18 && age < 50) || (age >= 50 && age < 55 && sum > 5000) || (sum > 3500 && age >= 55 && age < 69)) {

                requiredDocs = [];
                requiredDocs.push(['D40C4CDA-BE51-4F5C-89B6-46C5A6A65D8B', 'Письменное заявление Страхователя']);
                requiredDocs.push(['C1148B1B-2217-4C5C-B19E-829F748F265D', 'Анкета о состоянии здоровья Доп.застрахованного лица']);
                requiredDocs.push(['931D6F78-3EFE-460F-8072-C3090741BD1A', 'Форма медицинского обследования + ЭКГ с прекордиальными отведениями в покое и с нагрузкой + Клинический и биохимический анализы крови']);
            }

        }

        var docs = [];
        var stored = formDocuments.getItemsStore().data.items;
        for (var i = 0; stored[i] != undefined; i++) {
            var type = stored[i].data.DocTypeId;
            if (type) docs.push(type);
        }
        var contained = Enumerable.From(docs);
        var missing = Enumerable.From(requiredDocs).Where(function (s) { return !contained.Contains(s[0]); });
        return missing.ToArray();
    }

    var validateForms = function (calc, policy, payment, docs, scenario) {
        // Проверка форм на ошибки
        var sc = parseInt(updateScenario()); // принудительно обновляем сценарий

        var errors = [];
        var forms = [];

        if (calc) forms[forms.length] = formCalc;
        if (policy) forms[forms.length] = formPolicy;
        if (payment) forms[forms.length] = formPayment;

        for (var i = 0; forms[i] != undefined; i++) {
            if (!forms[i].form.isValid()) {
                errors.push('Форма "' + forms[i].title + '" содержит ошибки.');
            }
        }

        if (docs) {
            var docs = validateDocs(sc);
            if (docs.length) {
                for (var i = 0; docs[i] != undefined; i++) {
                    errors.push('Необходимо прикрепить "' + docs[i][1] + '".');
                }
            }
        }

        if (scenario) {
            if (sc == 0) {
                errors.push('<b>Полис не соответствует ни одному из известных сценариев</b>.');
            }
            if (sc >= 3 && !IsUnderwriter) {
                errors.push('<b>Полис содержит условия требующие проведения андеррайтинга</b>.');
            }
        }

        if (errors.length != 0) showErrors(errors, Ext.MessageBox.WARNING);
        return (errors.length == 0);
    };
    // Определение сценария полиса

    function updateScenario() {

        if (!scValidationFlag) return Ext.getCmp('Scenario').getValue();

        var sc = 3; // будем считать что все возможные сценарии учтены

        var sum = (((quote ? parseFloat(quote.PaymentSC) : 0)) || 1) / 1000;// (parseInt(Ext.getCmp('calcPaymentRaw').getValue()) || 1) / 1000;
        var tos = Ext.getCmp("docTOS").getValue();
        var tosChild = Ext.getCmp("docTOSChild").getValue();
        var tosSecond = Ext.getCmp("docTOSSecond").getValue();

        var insured2Enable = Ext.getCmp('calcInsured2Enable').getValue();

        var invalidRisks = Ext.getCmp('riskInvalid1').getValue(); // || Ext.getCmp('riskInvalid2').getValue() || Ext.getCmp('riskInvalid3').getValue();

        var insuredAge = getAge(Ext.getCmp('docInsuredBirthdate').getValue());
        var insuredResident = Ext.getCmp('docInsuredResident').getValue();
        var insuredRussian = Ext.getCmp('docInsuredNati').getValue() == 1;

        var insured2Age = getAge(Ext.getCmp('docInsured2Birthdate').getValue());
        var insured2Resident = Ext.getCmp('docInsured2Resident').getValue();
        var insured2Russian = insured2Enable && Ext.getCmp('docInsured2Nati').getValue() == 1;
        var insured2IsProfSafe = insured2Enable && (Ext.getCmp('docInsured2IsProfSafe').getValue() == "10F60816-5C7B-47BE-BE5C-46C13D6C5354");
        var insured2Works = insured2Enable && Ext.getCmp('docInsured2Employed').getValue();

        var insuredTable = Ext.getCmp('docInsuredAnketa6Yes').getValue() === false;
        var insured2Table = insured2Enable && (Ext.getCmp('docInsured2Anketa6Yes').getValue() === false);

        var anketa1OK = !Ext.getCmp('docInsuredAnketa5Yes').getValue();
        var anketa2OK = insured2Enable && !Ext.getCmp('docInsured2Anketa5Yes').getValue();


        var ctDocs = [];
        var hasDocs = false;

        try {

            var stored = formDocuments.getItemsStore().data.items; for (var i = 0; stored[i] != undefined; i++) { var type = stored[i].data.DocTypeId; if (type) ctDocs.push(type); }

            hasDocs = Enumerable.From(ctDocs).Any(function (s) { return (s.toUpperCase() == "D8860BF9-A26F-4199-8FF8-703B8202DC08") || (s.toUpperCase() == "20DFDC13-79CA-4B43-BAD5-21C31E87B32A"); });

        } catch (ex) { }

        var sc1 = [];

        sc1.push(((insured2Age >= 18 && insured2Age <= 50 && sum <= 1500) || (insured2Age >= 51 && insured2Age < 55 && sum <= 1000)) && (tosChild || tosSecond) && insured2Russian && insured2Enable && insured2Works && insured2IsProfSafe);

        if (Enumerable.From(sc1).Any("a => a == true")) sc = 1;

        var sc2 = [];
        sc2.push(((insured2Age >= 18 && insured2Age <= 50 && sum > 1500 && sum < 2500) || (insured2Age >= 51 && insured2Age < 55 && sum > 1000 && sum < 1500) || (insured2Age >= 56 && insured2Age < 69 && sum < 750)) && insured2Enable && insured2Russian && insured2Works && insured2IsProfSafe && anketa2OK);

        if (Enumerable.From(sc2).Any("a => a == true")) sc = 2;

        if (hasDocs || !anketa2OK || !insured2Works || !insured2IsProfSafe)
            sc = 3;

        var standard = sc === 1;

        if (IsUnderwriter) {
            if (Boolean(sc) && Ext.getCmp('Scenario').getValue() != sc)
                Virtu.Popup.msg("Сценарий изменился", "Новый сценарий: #" + sc + ".", 1.5);
        }

        var docs = validateDocs(sc);

        var mhtml = sc == 0 && docs.length ? '<p class="virtuTextRed">Список не определён</p>' : '<p class="virtuTextInactive">Прикрепление не требуется</p>';

        if (docs.length) {
            mhtml = '<ul>';
            for (var i = 0; docs[i] != undefined; i++) {
                mhtml = mhtml + '<li class="virtuText">' + docs[i][1] + '</li>';
            }
            mhtml = mhtml + '</ul>';
        }

        Ext.getCmp('docsToGo').setText(mhtml, false);

        Ext.getCmp('Scenario').setValue(sc);

        scenario = sc;

        return sc;
    }

    function MainMenu(name) {

        var template = [];

        template[0] = new Ext.Action({
            id: name + 'standart',
            text: 'Стандартный',
            iconCls: 'temp16',
            handler: function () {
                NewPolicyUrl(policyUrl + "?ProductID=" + productID);
            }
        });

        template[1] = new Ext.Action({
            id: name + 'aCopy',
            text: 'Копировать',
            iconCls: 'copy16',
            handler: function () {
                if (!validateForms(true)) return;
                CopyPolicy();
            }
        });

        var aNew = new Ext.Action({
            id: name + 'aNew',
            iconCls: 'edit16',
            text: "Новый полис",
            menu: new Ext.menu.Menu({
                items: [template]
            })
        });

        var aRequiestUW = new Ext.Action({
            id: name + 'aRequiestUW',
            text: 'Андреррайтинг',
            iconCls: 'pen16',
            handler: function () {
                RequiestUW();
            }
        });

        var aSave = new Ext.Action({
            id: name + 'aSave',
            text: 'Сохранить',
            iconCls: 'save16',
            handler: function () {
                if (!validateForms(true)) return;
                SavePolicy('CA791971-3028-47BD-8C49-94582E21F6B8');
            }
        });

        var aAccept = new Ext.Action({
            id: name + 'aAccept',
            text: 'Акцептовать',
            iconCls: 'accept16',
            handler: function () {
                if (!validateForms(true, true, true, true, true)) return;
                Ext.Msg.confirm('Акцептация полиса', 'Вы действительно хотите акцептовать полис?', function (btn) {
                    if (btn == 'yes') {
                        Ext.Msg.confirm('Акцептация полиса', 'Дополнительные документы распечатаны?', function (btn) {
                            if (btn == 'yes') {
                                AcceptPolicy('CA791971-3028-47BD-8C49-94582E21F6B8');
                            }
                        });
                    }
                });

            }
        });

        var aPrint = new Ext.Action({
            id: name + 'aPrint',
            text: 'Печать',
            iconCls: 'print16',
            menu: new Ext.menu.Menu({
                items: []
            })
        });

        var aNull = new Ext.Action({
            id: name + 'aNull',
            text: "Аннулировать",
            iconCls: 'null16',
            handler: function () {
                Ext.Msg.confirm('Аннулирование полиса', 'Вы действительно хотите аннулировать полис?', function (btn) {
                    if (btn == 'yes') {
                        DeletePolicy();
                    }
                });
            }
        });

        var aFinish = new Ext.Action({
            id: name + 'aFinish',
            text: "Завершить",
            iconCls: 'null16',
            handler: function () {
                Ext.Msg.confirm('Завершение полиса', 'Вы действительно хотите завершить полис?', function (btn) {
                    if (btn == 'yes') {
                        FinishPolicy();
                    }
                });
            }
        });
        var aPrintProposal = new Ext.Action({
            text: 'Предложение',
            iconCls: 'print16',
            handler: function () {
                PrintPolicy("proposal.mrt", true);
            }
        });


        return new Ext.Toolbar({ id: name, items: [aNew, '-', aSave, aAccept, aNull, aFinish, '-', aPrint, '-', aRequiestUW, '->', aPrintProposal] });
    }

    var aCalc = new Ext.Button({
        id: 'aCalc',
        text: 'Рассчитать',
        height: 18,
        iconCls: 'calc16',
        handler: function () {
            if (!validateForms(true)) return;
            CalculatePolicy();
        }
    });


    var aPrintPayment = new Ext.Button({
        id: 'aPrintPayment',
        text: 'Печать',
        handler: function () {
            if (!validateForms(true, false, true, false, true)) return;
            var policy = GetFormObject(formMain);
            if (!policy.SERIAL && !policy.NUMBER) {
                var res = invokeMeta(new Object({ cmd: 1, policy: policy }));
                Ext.getCmp('SERIAL').setValue(res.serial);
                Ext.getCmp('NUMBER').setValue(res.number);
            }
            PrintPolicy("payment.mrt", true);
        }
    });


    formPolicy = FormPolicy();

    formCalc = FormCalc(aCalc);
    Ext.getCmp('riskDeathCoef').setDisabled(IsAdmin || IsUnderwriter ? false : true);

    formPayment = FormPayment(aPrintPayment);

    formDocuments = new Virtu.DocumentPanelControl({ library: library, folderId: policyID, title: 'Прикреплённые файлы', DocTypeClassifierID: "588F3B65-A3C3-4DD6-85A1-3480280BEEA3" /*"29E855CC-E87C-4246-8AE7-77EB9C057F1D"*/, applications: null });

    var tabs = new Ext.TabPanel({
        id: 'tabpanel001',
        activeTab: 0, border: true,
        listeners: {
            'tabchange': function (tabPanel, newTab) {
            }
        },
        items: [formCalc, formPolicy, formPayment]
    });

    if (uploadTool) tabs.add(formDocuments);

    formMain = new Ext.Panel({
        id: 'mainform',
        padding: '5px 5px 5px 5px',
        header: true,
        autoHeight: true,
        region: 'center',
        renderTo: 'dMain',
        width: 850,
        border: true,
        forceLayout: true,
        labelWidth: 200,
        headerAsText: true,
        headerCssClass: 'headerEXT',
        title: titleForm,
        items: [tabs],
        bbar: MainMenu('mainmenu1'),
        tbar: MainMenu('mainmenu2')
    });

    BindPolicy();
    // без коментов
    tabs.setActiveTab(quote ? 1 : 0);
    //tabs.setActiveTab(1);

    // обнуление результатов расчёта
    formCalc.getForm().items.each(function (field) {
        if (field.frozen) return;
        field.on('change', function (f, n, o) {
            UpdateQuote(undefined, f);
        });
        field.on('check', function (f, n, o) {
            UpdateQuote(undefined, f);
        });
    });

    // TODO remove this
    // IsProfileValid = true;
    if (!IsProfileValid) {
        Virtu.Popup.msg(titleForm, 'В профиле продукта не указаны критически важные данные. Некоторые функции будут недоступны', 5);
        // showErrors(['В профиле продукта не указаны критически важные данные. Некоторые функции будут недоступны.'], Ext.MessageBox.INFO);
    }

    // валидация сценария
    Ext.TaskMgr.start({ run: function () { updateScenario(); }, interval: 333 });


    lMask = new Ext.LoadMask(Ext.getBody(), { msg: "Загрузка данных...", removeMask: true });

}

function ApplyStatus(doc) {


    var serial = doc.SERIAL;
    var number = doc.NUMBER;
    var poldate = doc.DocumentDate;
    var scenario = doc.Scenario;
    var statusName = GetStatusName(); //doc.StatusName || '';  // StatusName не робит

    var isDisabledState;
    var statusicon;

    quote = doc.Quote;

    isDisabledState = IsFinished || (!IsCorrector && (IsAccepted || IsAnnulated));

    setReadOnlyControls(formCalc, isDisabledState);
    setReadOnlyControls(formPolicy, isDisabledState);
    setReadOnlyControls(formPayment, isDisabledState);

    formDocuments.isReadOnly = isDisabledState;
    formDocuments.updateToolbar();
    formDocuments.folderId = policyID;
    formDocuments.UserLogin = userInfo.FullName;
    try {
        formDocuments.refreshStore();
    } catch (e) {

    }

    Ext.getCmp("aPrintPayment").setDisabled(IsFinished || IsAccepted || IsAnnulated || templateID);
    Ext.getCmp("aCalc").setDisabled(IsFinished || (!IsCorrector && (IsAccepted || IsAnnulated || templateID)));

    var updateMainMenu = function (name) {
        // IsProfileValid = true; // TODO uncomment
        Ext.getCmp(name + "aSave").setDisabled(isDisabledState);
        Ext.getCmp(name + "aRequiestUW").setDisabled(IsFinished || IsUnderwriter || !(IsProject && !IsUnderwriter && scenario == 3));
        Ext.getCmp(name + "aAccept").setDisabled(IsFinished || (!IsCorrector && (!IsProfileValid || !policyID || IsAccepted || IsAnnulated || IsFinished || templateID)));
        Ext.getCmp(name + "aNull").setDisabled(IsFinished || IsAnnulated || templateID || !policyID);
        Ext.getCmp(name + "aFinish").setDisabled(IsFinished || !IsAdmin || !policyID);
        Ext.getCmp(name + "aPrint").setDisabled(IsFinished);
    };


    updateMainMenu('mainmenu1');
    updateMainMenu('mainmenu2');

    // if (IsProject) statusicon = 'st_project';
    // if (IsAccepted || IsEffective || IsPaid) statusicon = 'st_accept';
    // if (IsAnnulated || IsFinished) statusicon = 'st_null';

    if (!serial) serial = '___';
    if (!number) number = '___';
    if (!poldate) poldate = '___';

    Ext.getCmp('mainform').setTitle("<table><tr><td rowspan='3'><div id='logoContainer'><img id='productLogo' src='../Resources/Images/dsLogo.jpg' class='dsLogo'></img></div></td><td class='botcell' width='100%'>Полис добровольного смешанного страхования жизни, страхования от несчастных случаев, болезней и опасных заболеваний «" + titleForm + "»</td><td rowspan='3'><div class='" + statusicon + "'></div></td></tr><tr><td class='botcell'>№ " + serial + " " + number + " от " + toPrintableDate(poldate) + " г.</td></tr><tr><td class='botcell'>" + statusName + "</td></tr></table>");

    document.title = titleForm;

    scValidationFlag = IsProject;

}

function showErrors(err, type, title) {
    Ext.Msg.hide();
    if (!err || !err[0]) return;
    if (!title) title = 'Приложение';
    var mhtml;
    if (err != null) {
        if (err.length != 0) {
            mhtml = '<ul>';
            for (var i = 0; i < err.length; i++) {
                var msg = '<li class="virtuError2">' + err[i] + '</li>';
                mhtml = mhtml + msg;
            }
            mhtml = mhtml + '</ul>';
        }
    }
    Ext.Msg.show({
        title: title,
        msg: mhtml,
        minWidth: 300,
        buttons: Ext.Msg.OK,
        icon: type
    });
}
