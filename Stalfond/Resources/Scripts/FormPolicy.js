/// <reference name="MicrosoftAjax.js"/>
/// <reference path="~/Scripts/Ext/adapter/ext/ext-base.js"/>
/// <reference path="~/scripts/Ext/ext-all.js"/>

function CopyKLADRAddressInsurer() {
    if (!IsProject) return;
    var from = 'docInsurerAddress';
    var to = 'docInsurerRealAddress';

    var cmpTo = Ext.getCmp(to);

    cmpTo.setValue(Ext.getCmp(from).getValue());
    cmpTo.fireEvent('change', cmpTo);
}

function CopyKLADRAddressInsured() {
    if (!IsProject) return;
    var from = 'docInsuredAddress';
    var to = 'docInsuredRealAddress';
    Ext.getCmp(to).setValue(Ext.getCmp(from).getValue());
}

function CopyKLADRAddressInsured2() {
    if (!IsProject) return;
    var from = 'docInsured2Address';
    var to = 'docInsured2RealAddress';
    Ext.getCmp(to).setValue(Ext.getCmp(from).getValue());
}

function CopyInsurer() { return CopyObject("Insurer", "Insured"); }

function CopyInsurer2() { return CopyObject("Insurer", "Insured2"); }

function CopyBen() { return CopyObject("Insurer", "Ben"); }

function CopyObject(fromObjName, toObjName) {
    if (!IsProject) return;
    var ctrlsInsurer = Ext.getCmp('panelPolicy').findBy(function (s) { return s.id.indexOf("doc" + fromObjName) != -1; });
    for (var i = 0; ctrlsInsurer[i] != undefined; i++) {
        var ctrlInsurer = ctrlsInsurer[i];
        var ctrlInsured = Ext.getCmp(ctrlsInsurer[i].id.replace(fromObjName, toObjName));
        if (ctrlInsured && !ctrlInsured.frozen && ctrlInsurer.getValue && ctrlInsured.getValue) {
            var insurerValue = ctrlInsurer.getValue();
            var insured2Value = ctrlInsured.getValue();

            if (insurerValue != insured2Value) {
                ctrlInsured.setValue(insurerValue);
            }
        }
    }
    return 1;
}

function checkInsured2IsInsurerCondition() {
    var invalid1Check = Ext.getCmp("riskInvalid1").getValue();
    var accidentDeathCheck = Ext.getCmp("riskAccidentDeath").getValue();

    return invalid1Check || accidentDeathCheck;
}

function insured2Update() {
    var insured2Enabled = Ext.getCmp('calcInsured2Enable').getValue();

    Ext.getCmp('insured2BuisnessPanel').setDisabled(!insured2Enabled || !Ext.getCmp('insured2BuisnessPanel').isVisible());

    Ext.getCmp('insured2GeneralPanel').setDisabled(!insured2Enabled || !Ext.getCmp('insured2GeneralPanel').isVisible());
        
    Ext.getCmp('docInsured2ResidentPanel').setDisabled(!insured2Enabled || !Ext.getCmp('docInsured2ResidentPanel').isVisible());

    Ext.getCmp('docInsured2NonResidentPanel').setDisabled(!insured2Enabled || !Ext.getCmp('docInsured2NonResidentPanel').isVisible());
    
    Ext.getCmp('docInsured2ForeignAddress').setDisabled(!insured2Enabled || !Ext.getCmp('docInsured2ForeignAddress').isVisible());

    Ext.getCmp('docInsured2AnketaPanel').setDisabled(!insured2Enabled || !Ext.getCmp('docInsured2AnketaPanel').isVisible());

    Ext.getCmp('InsurerAddressdocInsured2Address').allowBlank = !insured2Enabled || !Ext.getCmp('insured2GeneralPanel').isVisible();

    Ext.getCmp('InsurerAddressdocInsured2RealAddress').allowBlank = !insured2Enabled || !Ext.getCmp('insured2GeneralPanel').isVisible();

    var target = "Insured2";
    var russian = Ext.getCmp('doc' + target + 'Nati').getValue() == 1;
    var v = Ext.getCmp('insured2GeneralPanel').disabled;
    var works = Ext.getCmp("doc" + target + "Employed").getValue();

    Ext.getCmp('doc' + target + 'NatiOther').setDisabled(v || russian);
    Ext.getCmp('doc' + target + 'NatiOther').validate();
    Ext.getCmp("doc" + target + "Work").setDisabled(v || !works);
    Ext.getCmp("doc" + target + "WorkRank").setDisabled(v || !works);
    Ext.getCmp("doc" + target + "Work").validate();
    Ext.getCmp("doc" + target + "WorkRank").validate();

    var prof = Ext.getCmp("doc" + target + "IsProfSafe");
    if (prof) prof.setDisabled(!insured2Enabled || !works);
    if (prof) prof.validate();
    
    if (insured2Enabled) {
        setInsured2IsInsurer(checkInsured2IsInsurerCondition());
    }
}

function setInsured2IsInsurer(value) {
    var insured2GeneralPanelControls = Ext.getCmp('insured2GeneralPanel').findBy(function (s) {
        return s.id.indexOf("docInsured2") != -1;
    });

    for (var i = 0; insured2GeneralPanelControls[i] != undefined; i++) {
        var currentInsured2Control = insured2GeneralPanelControls[i];

        if (currentInsured2Control.insured2Specific == undefined || !currentInsured2Control.insured2Specific) {
            var currentInsurerControl = Ext.getCmp(currentInsured2Control.id.replace("docInsured2", "docInsurer"));

            if (currentInsurerControl != undefined) {
                if (value) {
                    currentInsurerControl.on('change', insurerTextfieldChange);
                } else {
                    currentInsurerControl.removeListener('change', insurerTextfieldChange);
                }
            }

            currentInsured2Control.setDisabled(value);
        }
    }

    Ext.getCmp("docInsured2ResidentPanel").setDisabled(value);
    Ext.getCmp("docInsured2NonResidentPanel").setDisabled(value);
    Ext.getCmp("insured2BuisnessPanel").setDisabled(value);
    
    if (value) {
        CopyInsurer2();
    }
}

function insurerTextfieldChange(o, e) {
    var currentInsured2Control = Ext.getCmp(o.id.replace("docInsurer", "docInsured2"));

    currentInsured2Control.setValue(o.getValue());
}

function validateHeightAndWidth(h, w) {
    h = parseInt(h);
    w = parseInt(w);
    var table = new Array();
    table.push([140, 145, 39, 57]);
    table.push([146, 150, 42, 62]);
    table.push([151, 155, 45, 67]);
    table.push([156, 160, 48, 71]);
    table.push([161, 165, 51, 75]);
    table.push([166, 170, 54, 81]);
    table.push([171, 175, 57, 86]);
    table.push([176, 180, 61, 90]);
    table.push([181, 185, 64, 96]);
    table.push([186, 190, 68, 101]);
    table.push([191, 195, 71, 106]);
    table.push([196, 200, 75, 112]);
    table.push([201, 205, 78, 117]);
    for (var i = 0; table[i] != undefined; i++) {
        var row = table[i];
        if (h >= row[0] && h <= row[1] && w >= row[2] && w <= row[3]) {
            return true;
        }
    }
    return false;
}

function FormPolicy() {

    var emptyGridMsg = '<div class="red-text-class">Список не может быть пустым</div>';
    var childGridMsg = '<div class="virtuTextInactive">Наследники</div>';

    function createBeneficiaryView() {
        return new Ext.grid.GridView({
            forceFit: true,
            enableRowBody: true,
            deferEmptyText: false,
            emptyText: emptyGridMsg,
            getRowClass: function (record, rowIndex, rp, ds) { return record.isValid ? 'x-grid3-row' : 'x-grid3-row red-class'; }
        });
    }

    function validateBeneficiary(record, list) {
        return record.data.isFormValid && validateTotalPct(list.getStore()) && (list != Ext.getCmp('docBenDeathList') || Ext.getCmp('docBenChildren').getValue() || validateIsInsured(list.getStore()));
    }

    function validatePassport(cmpBirthdate, cmpPassdate) {
        var birthdate = Ext.getCmp(cmpBirthdate).getValue();
        var passdate = Ext.getCmp(cmpPassdate).getValue();

        if (birthdate && passdate) {
            var age = getAge(birthdate);
            //if (passdate < birthdate.add(Date.YEAR, (age < 45) ? 20 : 45)) {
            if (age >= 20 && passdate < birthdate.add(Date.YEAR, (age < 45) ? 20 : 45)) {
                return false;
            }
        }
        return true;
    }

    var validateHealth2 = function () {
        var valid = Ext.getCmp('docInsured2AnketaPanel').hidden || ((Ext.getCmp('docInsured2PressureUpper').getValue() <= 130 && Ext.getCmp('docInsured2PressureLower').getValue() <= 95) && (validateHeightAndWidth(Ext.getCmp('docInsured2Height').getValue(), Ext.getCmp('docInsured2Weight').getValue())));
        Ext.getCmp('docInsured2Anketa6Yes').setValue(!valid);
    };

    var validateIsInsured = function (store) {
        var cnt = 0;
        for (var i = 0; store.getAt(i) != undefined; i++) {
            if (store.getAt(i).data.docBenIsInsured)
                cnt++;
        }
        if (cnt > 1) return false;
        return true;
    };

    var validateTotalPct = function (store) {
        var pct = 0;
        for (var i = 0; store.getAt(i) != undefined; i++) {
            pct += parseInt(store.getAt(i).data.docBenMoneyPct) || 0;
        }
        if (pct != 100) return false;
        return true;
    };

    var renderBeneficiary = function (value, metaData, record, rowIndex, colIndex) {
        if (value == 1) {
            if (record.data.docBenIsInsured) {
                var v = validateIsInsured(record.store);
                return v ? "Страхователь" : '<p class="red-text-class">' + "Страхователь" + '</p>';
            }
            return (record.data.docBenSecond + ' ' + record.data.docBenFirst + ' ' + record.data.docBenThird + ' (физ. лицо)').trim();
        }
        if (value == 2) {
            return (record.data.docBenOrgFullName + ' (юр. лицо)').trim();
        }
        return '';
    };

    var renderBeneficiaryPct = function (value, metadata, record) {
        if (!value) value = 0;
        var validPct = validateTotalPct(record.store);
        return validPct ? value + '%' : '<p class="red-text-class">' + value + '%</p>';
    };

    var renderBeneficiaryErrors = function (value, metadata, record) {
        if (!value) {
            metadata.attr = 'ext:qtip="' + 'Данные заполнены неверно' + '"';
            return '<p class="errorIcon16" />';
        }
        metadata.attr = '';
        return '';
    };

    var deleteBeneficiary = function (parent) {
        if (!IsProject) return;
        Ext.getCmp(parent).getStore().remove(Ext.getCmp(parent).getSelectionModel().getSelected());
    };
    var editBeneficiary = function (parent, isNew, addInsured) {

        if (!IsProject && isNew) return;

        if (parent == "docBenDeathList" && Ext.getCmp('docBenChildren').getValue()) {
            return;
        }

        var record;
        var ctrl = Ext.getCmp(parent);
        var store = ctrl.getStore();

        if (isNew) {
            // новый
            var recordType = store.recordType;
            record = new recordType;
            if (store.getCount() == 0) record.data.docBenMoneyPct = 100; // у первого ставим 100%
        } else {
            record = ctrl.getSelectionModel().getSelected();
        }

        if (!record) return;

        var isInsurerVisible = (parent == 'docBenSurvList');

        if (isNew && store.getCount() >= (maxBen)) {
            Ext.Msg.show({
                title: 'Приложение',
                msg: 'Достигнуто максимальное число Выгодоприобритателей',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        var form = new Ext.form.FormPanel({
            autoHeight: true,
            layout: 'fit',
            padding: '5',
            border: false,
            xtype: 'form',
            id: 'benFormUnique',
            headerCssClass: 'headerEXT',           
            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
            items: [PanelBeneficiary(isInsurerVisible)]
        });

        var okHandler = function (wnd) {

            if (!Ext.getCmp('docBenIsInsured').hidden && Ext.getCmp('docBenIsInsured').getValue()) {
                CopyBen();
            }

            var obj = formToObject(form);
            for (var member in obj) {
                record.data[member] = obj[member];
            }

            record.data.isFormValid = form.form.isValid();
            record.commit();

            if (isNew) {
                var cnt = store.getCount();
                store.add(record);
            }

            wnd.close();
        };

        var wnd = new Ext.Window({
            width: 850,
            shadow: false,
            resizable: false,
            autoHeight: true,
            title: "Выгодоприобритатель",
            fbar: new Ext.Toolbar({
                items: [new Ext.Action({
                    text: 'OK',
                    hidden: !IsCorrector && !IsProject,
                    handler: function () {

                        okHandler(wnd);

                    }
                }), new Ext.Action({ text: 'Закрыть', handler: function () { wnd.close(); } })]
            }),
            modal: true,
            items: [form]
        });

        // рендер        
        wnd.show();

        // Биндинг
        var obj = new Object();
        for (var member in record.data) {
            obj[member] = record.data[member];
        }

        objectToForm(obj, form);

        setReadOnlyControls(form, !IsCorrector && !IsProject);

        form.form.isValid();

        // Ня!
        if (addInsured) {
            Ext.getCmp("docBenIsInsured").setValue(true);
            okHandler(wnd);
        }
    };


    var validateChild = function () {

        if (Ext.getCmp('docInsuredNati').getValue() == 2 && (Ext.getCmp('riskInvalid1').getValue() || Ext.getCmp('riskAccidentHospital').getValue())) {
            return "Отключите риски «Инвалидность Застрахованного лица (ребенок-инвалид)» или  «Инвалидность Доп.Застрахованного лица (1гр.) от любых причин»";
        }

        return true;
    };

    var visibleCheck = function (target) {

        var russian = Ext.getCmp('doc' + target + 'Nati').getValue() == 1;
        var resident = Ext.getCmp('doc' + target + 'Resident').getValue();

        Ext.getCmp('doc' + target + 'NatiOther').setDisabled(russian);
        Ext.getCmp('doc' + target + 'NatiOther').validate();

        Ext.getCmp('doc' + target + 'NonResidentPanel').setVisible(!russian);
        Ext.getCmp('doc' + target + 'NonResidentPanel').setDisabled(russian);
        Ext.getCmp('doc' + target + 'ResidentPanel').setVisible(russian);
        Ext.getCmp('doc' + target + 'ResidentPanel').setDisabled(!russian);

        if (Ext.getCmp('doc' + target + 'Address') != undefined) Ext.getCmp('doc' + target + 'Address').setVisible(resident);
        if (Ext.getCmp('doc' + target + 'Address') != undefined) Ext.getCmp('doc' + target + 'Address').setDisabled(!resident);

        Ext.getCmp('doc' + target + 'RealAddress').setVisible(resident);
        Ext.getCmp('doc' + target + 'RealAddress').setDisabled(!resident);

        Ext.getCmp('doc' + target + 'ForeignAddressLabel').setVisible(!resident);
        Ext.getCmp('doc' + target + 'ForeignAddress').setVisible(!resident);
        Ext.getCmp('doc' + target + 'ForeignAddress').setDisabled(resident);

        if (target == 'Insured2') {

            insured2Update();

        }

        // спамятся Virtu.Popup.msg("Внимание!", "Необходимо заполнить заявление и анкету о состоянии здоровья Застрахованному лицу");
    };

    var childrenCheck = function () {
        var list = Ext.getCmp('docBenDeathList');
        var child = Ext.getCmp('docBenChildren').getValue();
        list.allowBlank = child;
        if (child) {
            list.getStore().removeAll();
            list.view.emptyText = childGridMsg;
        } else {
            list.view.emptyText = emptyGridMsg;
        }
        if (list.rendered) list.view.refresh();
        Ext.getCmp('docBenDeathTB').setVisible(!child);
    };

    function readOnlyChangedHandler(o, readOnly) {
        Ext.getCmp('benSurvAdd').setDisabled(readOnly);
        Ext.getCmp('benSurvDel').setDisabled(readOnly);
        Ext.getCmp('benDeathAdd').setDisabled(readOnly);
        Ext.getCmp('benDeathDel').setDisabled(readOnly);
    }

    function employedChanged(target) {
        var works = Ext.getCmp("doc" + target + "Employed").getValue();
        Ext.getCmp("doc" + target + "Work").setDisabled(!works);
        Ext.getCmp("doc" + target + "WorkRank").setDisabled(!works);
        Ext.getCmp("doc" + target + "Work").validate();
        Ext.getCmp("doc" + target + "WorkRank").validate();

        if (target == 'Insured2') {

            insured2Update();

        }
    }


    return new Ext.form.FormPanel({
        monitorValid: true,
        monitorPoll: 1000,
        autoHeight: true,
        id: 'panelPolicy',
        layout: 'fit',
        padding: '5',
        border: false,
        xtype: 'form',
        title: "Полис",
        readOnlyChanged: readOnlyChangedHandler,
        labelWidth: 500,
        headerCssClass: 'headerEXT',
        defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
        items: [
            {
                xtype: 'panel',
                frame: true,
                padding: '8',
                cls: 'tblayout-win',
                title: '',
                forceLayout: true,
                layout: 'table',
                layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 6 },
                autoHeight: true,
                defaults: { style: { margin: '0px' }, fieldClass: 'x-form-field' },
                items:
                    [
                        { xtype: 'displayfield', width: 125, value: 'Дата оформления:' },
                        { xtype: 'datefield', frozen: !IsCorrector, readOnly: !IsCorrector, width: 100, bind: true, allowBlank: false, format: "d.m.Y", id: 'DocumentDate', fieldLabel: 'Дата оформления', allowBlank: false },
                        { xtype: 'displayfield', width: 120, value: 'Серия:', cellCls: 'rightcell' },
                        { xtype: 'textfield', width: 115, frozen: true, readOnly: true, bind: true, emptyText: '(авто)', id: 'SERIAL', fieldLabel: 'Серия', allowBlank: true },
                        { xtype: 'displayfield', value: 'Номер:', cellCls: 'rightcell' },
                        { xtype: 'textfield', frozen: true, readOnly: true, bind: true, emptyText: '(авто)', id: 'NUMBER', fieldLabel: 'Номер', allowBlank: true },
                        { xtype: 'displayfield', width: 212, value: 'Согласие клиента с декларацией:' },
                        { xtype: 'combo', width: 100, bind: true, id: 'docTOS', editable: false, store: yesnoStore, fieldLabel: 'Клиент согласился с декларацией в Полисе', mode: 'local', typeAhead: false, triggerAction: 'all', allowBlank: false },
                        { xtype: 'spacer', width: 120 }, { xtype: 'spacer' },
                        { xtype: 'displayfield', hidden: !IsUnderwriter, width: 85, value: 'Сценарий:', cellCls: 'rightcell' },
                        { xtype: 'textfield', hidden: !IsUnderwriter, invalidText: 'Не удалось определить сценарий', validator: function (value) { return (value == 1 || value == 2 || value == 3 ? true : false); }, readOnly: true, frozen: true, emptyText: '(авто)', bind: true, id: 'Scenario', allowBlank: true },
                        { xtype: 'displayfield', colspan: 5, value: 'Подписана Декларация о здоровье застрахованного лица-ребенка:' },
                        { xtype: 'combo', width: 125, bind: true, id: 'docTOSChild', editable: false, store: yesnoStore, defaultValue: true, fieldLabel: 'Клиент согласился с декларацией в Полисе', mode: 'local', typeAhead: false, triggerAction: 'all' },
                        { xtype: 'displayfield', colspan: 5, id: 'docTOSSecondLabel', value: 'Подписана Декларация о здоровье доп.застрахованного лица:' },
                        { xtype: 'combo', width: 125, bind: true, id: 'docTOSSecond', editable: false, store: yesnoStore, defaultValue: true, fieldLabel: 'Клиент согласился с декларацией в Полисе', mode: 'local', typeAhead: false, triggerAction: 'all' },
                        { xtype: 'spacer', colspan: 6 },
                        { xtype: 'displayfield', width: 212, value: 'Для оформления:' },
                        { xtype: 'label', width: 581, preventScrollbars: true, autoScroll: false, frozen: true, hideBorders: true, readOnly: true, colspan: 5, id: 'docsToGo' },
                        { xtype: 'displayfield', width: 212, hidden: !IsCorrector, value: 'Дата начала действия полиса:' },
                        { xtype: 'datefield', frozen: true, hidden: !IsCorrector, readOnly: true, width: 100, bind: true, allowBlank: false, format: "d.m.Y", id: 'EffectiveDate', fieldLabel: 'Дата оформления', allowBlank: false, defaultValue: new Date().addDays(1) }
                    ]
            },
            {
                xtype: 'panel',
                border: true,
                frame: true,
                collapsible: true,
                style: { margin: '4px 0px 0px 0px' },
                cls: 'tblayout-win',
                title: "Страхователь",
                padding: '0',
                items:
                    [
                        {
                            xtype: 'panel',
                            border: true,
                            collapsible: true,
                            style: { margin: '4px 0px 0px 0px' },
                            padding: '0',
                            cls: 'tblayout-win',
                            title: "Общие данные",
                            forceLayout: true,
                            layout: 'table',
                            layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                            autoHeight: true,
                            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                            items:
                                [
                                    { xtype: 'displayfield', value: "ФИО:", width: 212, fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', width: 190, emptyText: 'Фамилия', bind: true, id: 'docInsurerSecond', allowBlank: false },
                                    { xtype: 'textfield', width: 190, emptyText: 'Имя', bind: true, id: 'docInsurerFirst', allowBlank: false },
                                    { xtype: 'textfield', width: 190, emptyText: 'Отчество', bind: true, id: 'docInsurerThird', allowBlank: false },
                                    { xtype: 'displayfield', value: "Место рождения:", fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', width: 582, colspan: 3, bind: true, id: 'docInsurerBirthPlace', allowBlank: false },
                                    { xtype: 'displayfield', value: "Дата рождения:", fieldClass: 'x-form-field' },
                                    { xtype: 'datefield', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsurerBirthdate', maxValue: maxAgeDateInsurer, fieldLabel: 'Дата рождения', allowBlank: false },
                                    { xtype: 'displayfield', cellCls: 'rightcell', value: "ИНН:", width: 189, fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', width: 190, bind: true, id: 'docInsurerINN', minLength: 12, maxLength: 12, allowBlank: true },
                                    { xtype: 'displayfield', value: "Гражданство:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', defaultValue: 1, rawValue: true, allowBlank: false, bind: true, listeners: { 'select': function () { visibleCheck('Insurer'); } }, id: 'docInsurerNati', width: 190, editable: false, store: countryStore, anchor: '100%', fieldLabel: 'Гражданство', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'textfield', colspan: 2, width: 386, bind: true, emptyText: 'Укажите гражданство', id: 'docInsurerNatiOther', allowBlank: false },
                                    { xtype: 'displayfield', value: "Резидент РФ:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', defaultValue: 1, allowBlank: false, bind: true, listeners: { 'select': function () { visibleCheck('Insurer'); } }, id: 'docInsurerResident', width: 581, colspan: 3, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', value: "Трудоустроен:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsurerEmployed', defaultValue: true, allowBlank: false, listeners: { 'select': function () { employedChanged('Insurer'); } }, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'textfield', emptyText: 'Место работы', width: 190, bind: true, id: 'docInsurerWork', allowBlank: true },
                                    { xtype: 'textfield', emptyText: 'Должность', width: 190, bind: true, id: 'docInsurerWorkRank', allowBlank: true },
                                    { xtype: 'displayfield', value: "Контактные данные:", fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', vtype: 'phone', plugins: new Ext.ux.plugin.FormatPhoneNumber(), emptyText: 'Телефон', width: 190, bind: true, id: 'docInsurerPhone', allowBlank: false },
                                    { xtype: 'textfield', emptyText: 'E-Mail', width: 190, colspan: 2, bind: true, id: 'docInsurerMail', allowBlank: true },
                                    new Virtu.Plugins.Address({ colspan: 4, bind: true, flatValue: true, id: 'docInsurerAddress', adressLabelText: "Адрес регистрации:", featureFramework: framework, columnX: [0, 216, 581], forbidCustomAddress: false }),
                                    new Virtu.Plugins.Address({ colspan: 4, bind: true, flatValue: true, id: 'docInsurerRealAddress', adressLabelText: "<table cellpadding='0' cellspacing='0' border='0'><tr><td>Фактический адрес:&nbsp;&nbsp;&nbsp;</td><td><div class='copypointer2' qtip='Копировать юридический адрес' onclick='CopyKLADRAddressInsurer();'</div></td></table>", featureFramework: framework, columnX: [0, 216, 581], forbidCustomAddress: false }),
                                    { xtype: 'displayfield', value: "Адрес регистрации:", fieldClass: 'x-form-field', id: 'docInsurerForeignAddressLabel' },
                                    { xtype: 'textfield', width: 582, colspan: 3, bind: true, id: 'docInsurerForeignAddress', allowBlank: false },
                                    { xtype: 'displayfield', colspan: 3, value: "Согласен на получение справочно-информационных сообщений на мой номер мобильного телефона:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsurerAllowInform', defaultValue: true, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
                                ]
                        },
                        {
                            xtype: 'panel',
                            hidden: false,
                            id: 'docInsurerResidentPanel',
                            border: false,
                            items: [
                                {
                                    xtype: 'panel',
                                    collapsible: true,
                                    style: { margin: '4px 0px 0px 0px' },
                                    padding: '0',
                                    cls: 'tblayout-win',
                                    title: 'Документ, удостоверяющий личность',
                                    forceLayout: true,
                                    layout: 'table',
                                    layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                    autoHeight: true,
                                    defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                    items:
                                        [
                                            { xtype: 'displayfield', value: "Вид документа:", width: 212, fieldClass: 'x-form-field' },
                                            { xtype: 'combo', bind: true, id: 'docInsurerPassType', defaultValue: "2E9D005B-4D52-4BE9-972C-EA6BD9D126EC", rawValue: true, colspan: 3, width: 581, editable: false, allowBlank: false, store: documentStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                            { xtype: 'displayfield', value: "Данные документа:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'textfield', emptyText: 'Серия', width: 190, minLength: 4, maxLength: 4, bind: true, id: 'docInsurerPassSerial', allowBlank: false },
                                            { xtype: 'textfield', emptyText: 'Номер', width: 190, minLength: 6, maxLength: 6, bind: true, id: 'docInsurerPassNumber', allowBlank: false },
                                            {
                                                xtype: 'datefield',
                                                emptyText: 'Дата',
                                                bind: true,
                                                width: 190,
                                                validator: function (v) {
                                                    if (Ext.getCmp('docInsurerPassType').getValue() == "2E9D005B-4D52-4BE9-972C-EA6BD9D126EC" && !validatePassport('docInsurerBirthdate', 'docInsurerPassDate')) return "Недопустимая дата выдачи паспорта";
                                                    // Далее стандартная валидация
                                                    return true;
                                                },
                                                maxValue: new Date(),
                                                allowBlank: false,
                                                format: "d.m.Y",
                                                id: 'docInsurerPassDate',
                                                fieldLabel: 'Дата выдачи',
                                                allowBlank: false
                                            },
                                            { xtype: 'displayfield', value: "Документ выдан:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'textfield', width: 386, colspan: 2, bind: true, id: 'docInsurerPassOrg', allowBlank: false },
                                            { xtype: 'textfield', bind: true, id: 'docInsurerPassOrgCode', emptyText: "Код подразделения", width: 190, fieldClass: 'x-form-field' }
                                        ]
                                }]
                        },
                        {
                            xtype: 'panel',
                            hidden: false,
                            id: 'docInsurerNonResidentPanel',
                            border: false,
                            items: [
                                {
                                    xtype: 'panel',
                                    collapsible: true,
                                    style: { margin: '4px 0px 0px 0px' },
                                    padding: '0',
                                    cls: 'tblayout-win',
                                    title: 'Документ, подтверждающий право на пребывание в РФ',
                                    forceLayout: true,
                                    layout: 'table',
                                    layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                    autoHeight: true,
                                    defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                    items:
                                        [
                                            { xtype: 'displayfield', value: "Вид документа:", width: 212, fieldClass: 'x-form-field' },
                                            { xtype: 'combo', bind: true, id: 'docInsurerVisaType', rawValue: true, colspan: 3, width: 581, editable: false, allowBlank: false, store: visaStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                            { xtype: 'displayfield', value: "Данные документа:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docInsurerVisaSerial', allowBlank: true },
                                            { xtype: 'textfield', emptyText: 'Номер', colspan: 2, width: 190, bind: true, id: 'docInsurerVisaNumber', allowBlank: false },
                                            { xtype: 'displayfield', value: "Дата начала срока действия:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsurerVisaDateStart', allowBlank: false },
                                            { xtype: 'displayfield', value: "Дата окончания срока:", cellCls: 'rightcell', width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsurerVisaDateEnd', allowBlank: false }
                                        ]
                                },
                                {
                                    xtype: 'panel',
                                    collapsible: true,
                                    style: { margin: '4px 0px 0px 0px' },
                                    padding: '0',
                                    cls: 'tblayout-win',
                                    title: 'Данные миграционной карты',
                                    forceLayout: true,
                                    layout: 'table',
                                    layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                    autoHeight: true,
                                    defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                    items:
                                        [
                                            { xtype: 'displayfield', value: "Данные документа:", width: 212, fieldClass: 'x-form-field' },
                                            { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docInsurerMigrationSerial', allowBlank: true },
                                            { xtype: 'textfield', emptyText: 'Номер', colspan: 2, width: 190, bind: true, id: 'docInsurerMigrationNumber', allowBlank: false },
                                            { xtype: 'displayfield', value: "Дата начала срока пребывания:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsurerMigrationDateStart', allowBlank: false },
                                            { xtype: 'displayfield', value: "Дата окончания срока:", cellCls: 'rightcell', width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsurerMigrationDateEnd', allowBlank: false }
                                        ]
                                }]
                        },
                        {
                            xtype: 'panel',
                            collapsible: true,
                            style: { margin: '4px 0px 0px 0px' },
                            padding: '0',
                            cls: 'tblayout-win',
                            title: 'Вид и условие деятельности',
                            forceLayout: true,
                            layout: 'table',
                            layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                            autoHeight: true,
                            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                            items:
                                [
                                    { xtype: 'displayfield', colspan: 3, value: "Действует в интересах (к выгоде) иностранного публичного должностного лица:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsurerBuisnessAct', defaultValue: '0', width: 190, editable: false, store: evidenceStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', colspan: 3, value: "Является руководителем или учредителем общественной или религиозной организации, благотворительного фонда, иностранной некоммерческой неправительственной организации:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsurerBuisnessBoss', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', colspan: 3, value: "Является резидентом особой экономической зоны:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsurerBuisnessEco', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }, //,
                                    { xtype: 'displayfield', colspan: 3, value: "Является иностранным публичным должностным лицом (его близким родственником):", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsurerPublicForeignPerson', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
                            // { xtype: 'displayfield', colspan: 3, value: "Осуществляемая деятельность не соответствует видам и условиям, перечисленным выше:", fieldClass: 'x-form-field' },
                            // { xtype: 'checkbox', bind: true, id: 'docInsurerBuisnessOther', defaultValue: true, disabled: true, frozen: true, width: 190, editable: false, anchor: '100%'} / / TODO
                                ]
                        }
                    ]
            },
            {
                xtype: 'panel',
                border: true,
                frame: true,
                collapsible: true,
                style: { margin: '4px 0px 0px 0px' },
                title: "Застрахованный",
                padding: '0',
                items:
                [
                    {
                        xtype: 'panel',
                        collapsible: true,
                        style: { margin: '4px 0px 0px 0px' },
                        padding: '0',
                        cls: 'tblayout-win',
                        title: 'Общие данные',
                        forceLayout: true,
                        layout: 'table',
                        layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                        autoHeight: true,
                        defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                        items:
                        [
                            { xtype: 'displayfield', value: "ФИО:", width: 212, fieldClass: 'x-form-field' },
                            { xtype: 'textfield', width: 190, emptyText: 'Фамилия', bind: true, id: 'docInsuredSecond', allowBlank: false },
                            { xtype: 'textfield', width: 190, emptyText: 'Имя', bind: true, id: 'docInsuredFirst', allowBlank: false },
                            { xtype: 'textfield', width: 190, emptyText: 'Отчество', bind: true, id: 'docInsuredThird', allowBlank: false },
                            { xtype: 'displayfield', value: "Место рождения:", fieldClass: 'x-form-field' },
                            { xtype: 'textfield', width: 582, colspan: 3, bind: true, id: 'docInsuredBirthPlace', allowBlank: false },
                            { xtype: 'displayfield', value: "Дата рождения:", fieldClass: 'x-form-field' },
                            { xtype: 'datefield', bind: true, emptyText: '(авто)', width: 190, readOnly: true, frozen: true, allowBlank: false, format: "d.m.Y", id: 'docInsuredBirthdate', fieldLabel: 'Дата рождения', allowBlank: false },
                            { xtype: 'displayfield', cellCls: 'rightcell', value: "ИНН:", width: 189, fieldClass: 'x-form-field' },
                            { xtype: 'textfield', width: 190, bind: true, id: 'docInsuredINN', minLength: 12, maxLength: 12, allowBlank: true },
                            { xtype: 'displayfield', value: "Гражданство:", fieldClass: 'x-form-field' },
                            { xtype: 'combo', defaultValue: 1, rawValue: true, allowBlank: false, bind: true, validator: validateChild, listeners: { 'select': function() { visibleCheck('Insured'); } }, id: 'docInsuredNati', width: 190, editable: false, store: countryStore, anchor: '100%', fieldLabel: 'Гражданство', mode: 'local', typeAhead: false, triggerAction: 'all' },
                            { xtype: 'textfield', colspan: 2, emptyText: 'Укажите гражданство', width: 386, bind: true, id: 'docInsuredNatiOther', allowBlank: false },
                            { xtype: 'displayfield', value: "Резидент РФ:", fieldClass: 'x-form-field' },
                            { xtype: 'combo', defaultValue: 1, frozen: true, readOnly: false, allowBlank: false, bind: true, listeners: { 'select': function() { visibleCheck('Insured'); } }, id: 'docInsuredResident', width: 581, colspan: 3, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                            { xtype: 'displayfield', frozen: true, hidden: true, value: "Трудоустроен:", fieldClass: 'x-form-field' },
                            { xtype: 'combo', frozen: true, hidden: true, bind: true, id: 'docInsuredEmployed', defaultValue: true, allowBlank: false, listeners: { 'select': function() { employedChanged('Insured'); } }, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                            { xtype: 'textfield', frozen: true, hidden: true, emptyText: 'Место работы', width: 190, bind: true, id: 'docInsuredWork', allowBlank: true },
                            { xtype: 'textfield', frozen: true, hidden: true, emptyText: 'Должность', width: 190, bind: true, id: 'docInsuredWorkRank', allowBlank: true },
                            //             	{ xtype: 'displayfield', frozen: true, hidden: true, value: "Профессия:", fieldClass: 'x-form-field' },
                            //             	{ xtype: 'combo', frozen: true, hidden: true, allowBlank: false, bind: true, id: 'docInsuredIsProfSafe', width: 582, colspan: 3, editable: false, store: profStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                            { xtype: 'displayfield', frozen: true, hidden: true, value: "Контактные данные:", fieldClass: 'x-form-field' },
                            { xtype: 'textfield', frozen: true, hidden: true, vtype: 'phone', plugins: new Ext.ux.plugin.FormatPhoneNumber(), emptyText: 'Телефон', width: 190, bind: true, id: 'docInsuredPhone', allowBlank: true },
                            { xtype: 'textfield', frozen: true, hidden: true, emptyText: 'E-Mail', width: 190, colspan: 2, bind: true, id: 'docInsuredMail', allowBlank: true },
                            new Virtu.Plugins.Address({ colspan: 4, bind: true, id: 'docInsuredRealAddress', flatValue: true, adressLabelText: "Фактический адрес:", featureFramework: framework, columnX: [0, 216, 581], forbidCustomAddress: false }),
                            { xtype: 'displayfield', frozen: true, hidden: true, value: "Адрес регистрации:", fieldClass: 'x-form-field', id: 'docInsuredForeignAddressLabel' },
                            { xtype: 'textfield', frozen: true, hidden: true, width: 582, colspan: 3, bind: true, id: 'docInsuredForeignAddress', allowBlank: false }
                            //{ xtype: 'textfield', emptyText: 'Должность', width: 190, bind: true, id: 'docInsuredWorkRank', allowBlank: false },
                            //{ xtype: 'displayfield', colspan: 3, value: "Согласен на получение справочно-информационных сообщений на мой номер мобильного телефона:", fieldClass: 'x-form-field' },
                            //{ xtype: 'combo', bind: true, id: 'docInsuredAllowInform', defaultValue: true, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                        ]
                    },
                    {
                        xtype: 'panel',
                        hidden: false,
                        id: 'docInsuredResidentPanel',
                        border: false,
                        items: [
                            {
                                xtype: 'panel',
                                collapsible: true,
                                style: { margin: '4px 0px 0px 0px' },
                                padding: '0',
                                cls: 'tblayout-win',
                                title: 'Документ, удостоверяющий личность',
                                forceLayout: true,
                                layout: 'table',
                                layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                autoHeight: true,
                                defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                items:
                                [
                                    { xtype: 'displayfield', value: "Вид документа:", width: 212, fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsuredPassType', defaultValue: "76287A37-ADB9-4933-A78A-1E21B573B8A9", rawValue: true, colspan: 3, width: 581, editable: false, allowBlank: false, store: documentStore2, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', value: "Данные документа:", width: 190, fieldClass: 'x-form-field' },
                                    {
                                        xtype: 'textfield',
                                        emptyText: 'Серия',
                                        width: 190,
                                        bind: true,
                                        minLength: 4,
                                        maxLength: 4,
                                        id: 'docInsuredPassSerial',
                                        allowBlank: false//,
                                        //validator: function (v) {
                                                //    //if (Ext.getCmp('docInsuredPassType').getValue() == "76287A37-ADB9-4933-A78A-1E21B573B8A9") return undefined;
                                                //    return true;
                                                //}
                                    },
                                    { xtype: 'textfield', emptyText: 'Номер', width: 190, bind: true, minLength: 6, maxLength: 6, id: 'docInsuredPassNumber', allowBlank: false },
                                    {
                                        xtype: 'datefield',
                                        emptyText: 'Дата',
                                        bind: true,
                                        validator: function(v) {
                                            if (Ext.getCmp('docInsuredPassType').getValue() == "2E9D005B-4D52-4BE9-972C-EA6BD9D126EC" && !validatePassport('docInsuredBirthdate', 'docInsuredPassDate')) return "Недопустимая дата выдачи паспорта";
                                            return true;
                                        },
                                        width: 190,
                                        maxValue: new Date(),
                                        format: "d.m.Y",
                                        id: 'docInsuredPassDate',
                                        fieldLabel: 'Дата выдачи',
                                        allowBlank: false
                                    },
                                    { xtype: 'displayfield', value: "Документ выдан:", width: 190, fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', width: 386, colspan: 2, bind: true, id: 'docInsuredPassOrg', allowBlank: false },
                                    { xtype: 'textfield', bind: true, id: 'docInsuredPassOrgCode', emptyText: "Код подразделения", width: 190, fieldClass: 'x-form-field' }
                                ]
                            }]
                    },
                    {
                        xtype: 'panel',
                        hidden: false,
                        id: 'docInsuredNonResidentPanel',
                        border: false,
                        items: [
                            {
                                xtype: 'panel',
                                collapsible: true,
                                style: { margin: '4px 0px 0px 0px' },
                                padding: '0',
                                cls: 'tblayout-win',
                                title: 'Документ, подтверждающий право на пребывание в РФ',
                                forceLayout: true,
                                layout: 'table',
                                layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                autoHeight: true,
                                defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                items:
                                [
                                    { xtype: 'displayfield', value: "Вид документа:", width: 212, fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsuredVisaType', rawValue: true, colspan: 3, width: 581, editable: false, allowBlank: false, store: visaStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', value: "Данные документа:", width: 190, fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docInsuredVisaSerial', allowBlank: true },
                                    { xtype: 'textfield', emptyText: 'Номер', colspan: 2, width: 190, bind: true, id: 'docInsuredVisaNumber', allowBlank: false },
                                    { xtype: 'displayfield', value: "Дата начала срока действия:", width: 190, fieldClass: 'x-form-field' },
                                    { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsuredVisaDateStart', allowBlank: false },
                                    { xtype: 'displayfield', value: "Дата окончания срока:", cellCls: 'rightcell', width: 190, fieldClass: 'x-form-field' },
                                    { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsuredVisaDateEnd', allowBlank: false }
                                ]
                            },
                            {
                                xtype: 'panel',
                                collapsible: true,
                                style: { margin: '4px 0px 0px 0px' },
                                padding: '0',
                                cls: 'tblayout-win',
                                title: 'Данные миграционной карты',
                                forceLayout: true,
                                layout: 'table',
                                layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                autoHeight: true,
                                defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                items:
                                [
                                    { xtype: 'displayfield', value: "Данные документа:", width: 212, fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docInsuredMigrationSerial', allowBlank: true },
                                    { xtype: 'textfield', emptyText: 'Номер', colspan: 2, width: 190, bind: true, id: 'docInsuredMigrationNumber', allowBlank: false },
                                    { xtype: 'displayfield', value: "Дата начала срока пребывания:", width: 190, fieldClass: 'x-form-field' },
                                    { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsuredMigrationDateStart', allowBlank: false },
                                    { xtype: 'displayfield', value: "Дата окончания срока:", cellCls: 'rightcell', width: 190, fieldClass: 'x-form-field' },
                                    { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsuredMigrationDateEnd', allowBlank: false }
                                ]
                            }]
                    },
                    {
                        xtype: 'panel',
                        hidden: true,
                        collapsible: true,
                        style: { margin: '4px 0px 0px 0px' },
                        padding: '0',
                        cls: 'tblayout-win',
                        title: 'Вид и условие деятельности',
                        forceLayout: true,
                        layout: 'table',
                        layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                        autoHeight: true,
                        defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                        items:
                        [
                            { xtype: 'displayfield', colspan: 3, value: "Действует в интересах (к выгоде) иностранного публичного должностного лица:", fieldClass: 'x-form-field' },
                            { xtype: 'combo', bind: true, id: 'docInsuredBuisnessAct', defaultValue: '0', width: 190, editable: false, store: evidenceStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                            { xtype: 'displayfield', colspan: 3, value: "Является руководителем или учредителем общественной или религиозной организации, благотворительного фонда, иностранной некоммерческой неправительственной организации:", fieldClass: 'x-form-field' },
                            { xtype: 'combo', bind: true, id: 'docInsuredBuisnessBoss', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                            { xtype: 'displayfield', colspan: 3, value: "Является резидентом особой экономической зоны:", fieldClass: 'x-form-field' },
                            { xtype: 'combo', bind: true, id: 'docInsuredBuisnessEco', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }, //,
                            { xtype: 'displayfield', colspan: 3, value: "Является иностранным публичным должностным лицом (его близким родственником):", fieldClass: 'x-form-field' },
                            { xtype: 'combo', bind: true, id: 'docInsuredPublicForeignPerson', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
                            // { xtype: 'displayfield', colspan: 3, value: "Осуществляемая деятельность не соответствует видам и условиям, перечисленным выше:", fieldClass: 'x-form-field' },
                            // { xtype: 'checkbox', bind: true, id: 'docInsurerBuisnessOther', defaultValue: true, disabled: true, frozen: true, width: 190, editable: false, anchor: '100%'} / / TODO
                        ]
                    },
                    {
                        xtype: 'panel',
                        id: 'docInsuredAnketaPanel',
                        hidden: false,
                        disabled: false,
                        collapsible: true,
                        style: { margin: '4px 0px 0px 0px' },
                        padding: '0',
                        cls: 'tblayout-win',
                        title: 'Данные о состоянии здоровья ',
                        forceLayout: true,
                        layout: 'table',
                        layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                        autoHeight: true,
                        defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                        items:
                        [
                            { xtype: 'displayfield', colspan: 2, value: "Рост в сантиметрах, вес в килограммах:", fieldClass: 'x-form-field' },
                            { xtype: 'numberfield', minValue: 1, emptyText: 'СМ', width: 190, bind: true, id: 'docInsuredHeight', allowBlank: false },
                            { xtype: 'numberfield', minValue: 1, emptyText: 'КГ', width: 190, bind: true, id: 'docInsuredWeight', allowBlank: false },
                            { xtype: 'displayfield', colspan: 2, value: "Результаты последнего измерения артериального давления, мм.рт.ст.:", fieldClass: 'x-form-field' },
                            { xtype: 'numberfield', minValue: 1, emptyText: 'Cистолическое (верхнее)', width: 190, bind: true, id: 'docInsuredPressureUpper', allowBlank: false },
                            { xtype: 'numberfield', minValue: 1, emptyText: 'Диастолическое (нижнее)', width: 190, bind: true, id: 'docInsuredPressureLower', allowBlank: false },
                            { xtype: 'displayfield', value: 'Есть нарушение критериев по Таблице допустимых соотношений между ростом и весом и давлением Застрахованного лица:', colspan: 3, fieldClass: 'x-form-field' },
                            {
                                xtype: 'combo',
                                bind: true,
                                readOnly: true,
                                frozen: true,
                                id: 'docInsuredAnketa6Yes',
                                allowBlank: false,
                                width: 190,
                                editable: false,
                                store: yesnoStore,
                                anchor: '100%',
                                mode: 'local',
                                typeAhead: false,
                                triggerAction: 'all',
                                defaultValue: false
                            },
                            { xtype: 'displayfield', value: 'В Анкете о состоянии здоровья – есть ответы «Да»:', colspan: 3, fieldClass: 'x-form-field' },
                            { xtype: 'combo', bind: true, id: 'docInsuredAnketa5Yes', allowBlank: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
                            // или/и 7
                        ]
                    }]
            },
            {
                xtype: 'panel',
                border: true,
                id: "insured2Panel",
                frame: true,
                collapsible: true,
                style: { margin: '4px 0px 0px 0px' },
                title: "<table cellpadding='0' cellspacing='0' border='0'><tr><td>Дополнительный Застрахованный&nbsp;&nbsp;&nbsp;</td><td><div qtip='Копировать данные Страхователя' class='copypointer2' onclick='CopyInsurer2();'</div></td></table>",
                padding: '0',
                items:
                    [
                        {
                            xtype: 'panel',
                            collapsible: true,
                            style: { margin: '4px 0px 0px 0px' },
                            padding: '0',
                            cls: 'tblayout-win',
                            title: 'Общие данные',
                            forceLayout: true,
                            layout: 'table',
                            id: 'insured2GeneralPanel',
                            layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                            autoHeight: true,
                            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                            items:
                                [
                                    { xtype: 'displayfield', value: "ФИО:", width: 212, fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', width: 190, emptyText: 'Фамилия', bind: true, id: 'docInsured2Second', allowBlank: false },
                                    { xtype: 'textfield', width: 190, emptyText: 'Имя', bind: true, id: 'docInsured2First', allowBlank: false },
                                    { xtype: 'textfield', width: 190, emptyText: 'Отчество', bind: true, id: 'docInsured2Third', allowBlank: false },
                                    { xtype: 'displayfield', value: "Место рождения:", fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', width: 582, colspan: 3, bind: true, id: 'docInsured2BirthPlace', allowBlank: false },
                                    { xtype: 'displayfield', value: "Дата рождения:", fieldClass: 'x-form-field' },
                                    { xtype: 'datefield', bind: true, emptyText: '(авто)', width: 190, readOnly: true, frozen: true, allowBlank: false, format: "d.m.Y", id: 'docInsured2Birthdate', fieldLabel: 'Дата рождения', allowBlank: false },
                                    { xtype: 'displayfield', cellCls: 'rightcell', value: "ИНН:", width: 189, fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', width: 190, bind: true, id: 'docInsured2INN', minLength: 12, maxLength: 12, allowBlank: true },
                                    { xtype: 'displayfield', value: "Гражданство:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', defaultValue: 1, frozen: true, readOnly: false, rawValue: true, allowBlank: false, bind: true, listeners: { 'select': function () { visibleCheck('Insured2'); } }, id: 'docInsured2Nati', width: 190, editable: false, store: countryStore, anchor: '100%', fieldLabel: 'Гражданство', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'textfield', colspan: 2, emptyText: 'Укажите гражданство', width: 386, bind: true, id: 'docInsured2NatiOther', allowBlank: false },
                                    { xtype: 'displayfield', value: "Резидент РФ:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', defaultValue: 1, frozen: true, readOnly: false, allowBlank: false, bind: true, listeners: { 'select': function () { visibleCheck('Insured2'); } }, id: 'docInsured2Resident', width: 581, colspan: 3, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', value: "Трудоустроен:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsured2Employed', defaultValue: true, allowBlank: false, listeners: { 'select': function () { employedChanged('Insured2'); } }, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'textfield', emptyText: 'Место работы', width: 190, bind: true, id: 'docInsured2Work', allowBlank: true },
                                    { xtype: 'textfield', emptyText: 'Должность', width: 190, bind: true, id: 'docInsured2WorkRank', allowBlank: true },
                                    { xtype: 'displayfield', value: "Профессия:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', allowBlank: false, bind: true, id: 'docInsured2IsProfSafe', width: 582, colspan: 3, editable: false, store: profStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all', insured2Specific: true },
                                    { xtype: 'displayfield', value: "Контактные данные:", fieldClass: 'x-form-field' },
                                    { xtype: 'textfield', vtype: 'phone', plugins: new Ext.ux.plugin.FormatPhoneNumber(), emptyText: 'Телефон', width: 190, bind: true, id: 'docInsured2Phone', allowBlank: false },
                                    { xtype: 'textfield', emptyText: 'E-Mail', width: 190, colspan: 2, bind: true, id: 'docInsured2Mail', allowBlank: true },
                                    new Virtu.Plugins.Address({ colspan: 4, bind: true, id: 'docInsured2Address', disabled: true, flatValue: true, adressLabelText: "Адрес регистрации:", featureFramework: framework, columnX: [0, 216, 581], forbidCustomAddress: false }),
                                    new Virtu.Plugins.Address({ colspan: 4, bind: true, id: 'docInsured2RealAddress', disabled: true, flatValue: true, adressLabelText: "<table cellpadding='0' cellspacing='0' border='0'><tr><td>Фактический адрес:&nbsp;&nbsp;&nbsp;</td><td><div class='copypointer2' qtip='Копировать юридический адрес' onclick='CopyKLADRAddressInsured2();'</div></td></table>", featureFramework: framework, columnX: [0, 216, 581], forbidCustomAddress: false }),
                                    { xtype: 'displayfield', value: "Адрес регистрации:", fieldClass: 'x-form-field', id: 'docInsured2ForeignAddressLabel' },
                                    { xtype: 'textfield', width: 582, colspan: 3, bind: true, id: 'docInsured2ForeignAddress', allowBlank: false }
                            //{ xtype: 'textfield', emptyText: 'Должность', width: 190, bind: true, id: 'docInsured2WorkRank', allowBlank: false },
                            //{ xtype: 'displayfield', colspan: 3, value: "Согласен на получение справочно-информационных сообщений на мой номер мобильного телефона:", fieldClass: 'x-form-field' },
                            //{ xtype: 'combo', bind: true, id: 'docInsured2AllowInform', defaultValue: true, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                ]
                        },
                        {
                            xtype: 'panel',
                            hidden: false,
                            id: 'docInsured2ResidentPanel',
                            border: false,
                            items: [
                                {
                                    xtype: 'panel',
                                    collapsible: true,
                                    style: { margin: '4px 0px 0px 0px' },
                                    padding: '0',
                                    cls: 'tblayout-win',
                                    title: 'Документ, удостоверяющий личность',
                                    forceLayout: true,
                                    layout: 'table',
                                    layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                    autoHeight: true,
                                    defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                    items:
                                        [
                                            { xtype: 'displayfield', value: "Вид документа:", width: 212, fieldClass: 'x-form-field' },
                                            { xtype: 'combo', bind: true, id: 'docInsured2PassType', defaultValue: "2E9D005B-4D52-4BE9-972C-EA6BD9D126EC", rawValue: true, colspan: 3, width: 581, editable: false, allowBlank: false, store: documentStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                            { xtype: 'displayfield', value: "Данные документа:", width: 190, fieldClass: 'x-form-field' },
                                            {
                                                xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, minLength: 4, maxLength: 4, id: 'docInsured2PassSerial', allowBlank: false,
                                                validator: function (v) {
                                                    if (Ext.getCmp('docInsured2PassType').getValue() == "76287A37-ADB9-4933-A78A-1E21B573B8A9") return undefined;
                                                    return true;
                                                }
                                            },
                                            { xtype: 'textfield', emptyText: 'Номер', width: 190, bind: true, minLength: 6, maxLength: 6, id: 'docInsured2PassNumber', allowBlank: false },
                                            {
                                                xtype: 'datefield',
                                                emptyText: 'Дата',
                                                bind: true,
                                                validator: function (v) {
                                                    if (Ext.getCmp('docInsured2PassType').getValue() == "2E9D005B-4D52-4BE9-972C-EA6BD9D126EC" && !validatePassport('docInsured2Birthdate', 'docInsured2PassDate')) return "Недопустимая дата выдачи паспорта";
                                                    return true;
                                                },
                                                width: 190,
                                                maxValue: new Date(),
                                                format: "d.m.Y",
                                                id: 'docInsured2PassDate',
                                                fieldLabel: 'Дата выдачи',
                                                allowBlank: false
                                            },
                                            { xtype: 'displayfield', value: "Документ выдан:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'textfield', width: 386, colspan: 2, bind: true, id: 'docInsured2PassOrg', allowBlank: false },
                                            { xtype: 'textfield', bind: true, id: 'docInsured2PassOrgCode', emptyText: "Код подразделения", width: 190, fieldClass: 'x-form-field' }
                                        ]
                                }]
                        },
                        {
                            xtype: 'panel',
                            hidden: false,
                            id: 'docInsured2NonResidentPanel',
                            border: false,
                            items: [
                                {
                                    xtype: 'panel',
                                    collapsible: true,
                                    style: { margin: '4px 0px 0px 0px' },
                                    padding: '0',
                                    cls: 'tblayout-win',
                                    title: 'Документ, подтверждающий право на пребывание в РФ',
                                    forceLayout: true,
                                    layout: 'table',
                                    layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                    autoHeight: true,
                                    defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                    items:
                                        [
                                            { xtype: 'displayfield', value: "Вид документа:", width: 212, fieldClass: 'x-form-field' },
                                            { xtype: 'combo', bind: true, id: 'docInsured2VisaType', rawValue: true, colspan: 3, width: 581, editable: false, allowBlank: false, store: visaStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                            { xtype: 'displayfield', value: "Данные документа:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docInsured2VisaSerial', allowBlank: true },
                                            { xtype: 'textfield', emptyText: 'Номер', colspan: 2, width: 190, bind: true, id: 'docInsured2VisaNumber', allowBlank: false },
                                            { xtype: 'displayfield', value: "Дата начала срока действия:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsured2VisaDateStart', allowBlank: false },
                                            { xtype: 'displayfield', value: "Дата окончания срока:", cellCls: 'rightcell', width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsured2VisaDateEnd', allowBlank: false }
                                        ]
                                },
                                {
                                    xtype: 'panel',
                                    collapsible: true,
                                    style: { margin: '4px 0px 0px 0px' },
                                    padding: '0',
                                    cls: 'tblayout-win',
                                    title: 'Данные миграционной карты',
                                    forceLayout: true,
                                    layout: 'table',
                                    layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                                    autoHeight: true,
                                    defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                                    items:
                                        [
                                            { xtype: 'displayfield', value: "Данные документа:", width: 212, fieldClass: 'x-form-field' },
                                            { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docInsured2MigrationSerial', allowBlank: true },
                                            { xtype: 'textfield', emptyText: 'Номер', colspan: 2, width: 190, bind: true, id: 'docInsured2MigrationNumber', allowBlank: false },
                                            { xtype: 'displayfield', value: "Дата начала срока пребывания:", width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsured2MigrationDateStart', allowBlank: false },
                                            { xtype: 'displayfield', value: "Дата окончания срока:", cellCls: 'rightcell', width: 190, fieldClass: 'x-form-field' },
                                            { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docInsured2MigrationDateEnd', allowBlank: false }
                                        ]
                                }]
                        },
                        {
                            xtype: 'panel',
                            collapsible: true,
                            style: { margin: '4px 0px 0px 0px' },
                            padding: '0',
                            id: 'insured2BuisnessPanel',
                            cls: 'tblayout-win',
                            title: 'Вид и условие деятельности',
                            forceLayout: true,
                            layout: 'table',
                            layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                            autoHeight: true,
                            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                            items:
                                [
                                    { xtype: 'displayfield', colspan: 3, value: "Действует в интересах (к выгоде) иностранного публичного должностного лица:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsured2BuisnessAct', defaultValue: '0', width: 190, editable: false, store: evidenceStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', colspan: 3, value: "Является руководителем или учредителем общественной или религиозной организации, благотворительного фонда, иностранной некоммерческой неправительственной организации:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsured2BuisnessBoss', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', colspan: 3, value: "Является резидентом особой экономической зоны:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsured2BuisnessEco', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }, //,
                                    { xtype: 'displayfield', colspan: 3, value: "Является иностранным публичным должностным лицом (его близким родственником):", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsured2PublicForeignPerson', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
                            // { xtype: 'displayfield', colspan: 3, value: "Осуществляемая деятельность не соответствует видам и условиям, перечисленным выше:", fieldClass: 'x-form-field' },
                            // { xtype: 'checkbox', bind: true, id: 'docInsurerBuisnessOther', defaultValue: true, disabled: true, frozen: true, width: 190, editable: false, anchor: '100%'} / / TODO
                                ]
                        },
                        {
                            xtype: 'panel',
                            id: 'docInsured2AnketaPanel',
                            hidden: false,
                            disabled: false,
                            collapsible: true,
                            style: { margin: '4px 0px 0px 0px' },
                            padding: '0',
                            cls: 'tblayout-win',
                            title: 'Данные о состоянии здоровья ',
                            forceLayout: true,
                            layout: 'table',
                            layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                            autoHeight: true,
                            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                            items:
                                [
                                    { xtype: 'displayfield', colspan: 2, value: "Рост в сантиметрах, вес в килограммах:", fieldClass: 'x-form-field' },
                            // { xtype: 'displayfield', value: "Вес в килограммах:", width: 190, fieldClass: 'x-form-field' },
                                    { xtype: 'numberfield', minValue: 1, listeners: { 'valid': validateHealth2 }, emptyText: 'СМ', width: 190, bind: true, id: 'docInsured2Height', allowBlank: false },
                                    { xtype: 'numberfield', minValue: 1, listeners: { 'valid': validateHealth2 }, emptyText: 'КГ', width: 190, bind: true, id: 'docInsured2Weight', allowBlank: false },
                                    { xtype: 'displayfield', colspan: 2, value: "Результаты последнего измерения артериального давления, мм.рт.ст.:", fieldClass: 'x-form-field' },
                                    { xtype: 'numberfield', minValue: 1, listeners: { 'valid': validateHealth2 }, emptyText: 'Cистолическое (верхнее)', width: 190, bind: true, id: 'docInsured2PressureUpper', allowBlank: false },
                            // { xtype: 'displayfield', cellCls: 'rightcell', value: "", fieldClass: 'x-form-field' },
                                    { xtype: 'numberfield', minValue: 1, listeners: { 'valid': validateHealth2 }, emptyText: 'Диастолическое (нижнее)', width: 190, bind: true, id: 'docInsured2PressureLower', allowBlank: false },
                                    { xtype: 'displayfield', value: 'Есть нарушение критериев по Таблице допустимых соотношений между ростом и весом и давлением Застрахованного лица:', colspan: 3, fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, readOnly: true, frozen: true, id: 'docInsured2Anketa6Yes', allowBlank: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    //{ xtype: 'displayfield', value: 'Есть нарушение критериев по Таблице объема медицинского обследования:', colspan: 3, fieldClass: 'x-form-field' },
                                    //{ xtype: 'combo', bind: true, id: 'docInsured2Anketa7Yes', allowBlank: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    { xtype: 'displayfield', value: 'В Анкете о состоянии здоровья – есть ответы «Да»:', colspan: 3, fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docInsured2Anketa5Yes', allowBlank: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
                            // или/и 7
                                ]
                        }]
            },
            {
                xtype: 'panel',
                border: true,
                frame: true,
                collapsible: true,
                style: { margin: '4px 0px 0px 0px' },
                cls: 'tblayout-win',
                title: "Выгодоприобритатели",
                padding: '0',
                items:
                    [
                        {
                            xtype: 'panel',
                            id: 'docBenSurv',
                            layout: 'form',
                            padding: '0px',
                            style: { margin: '4px 0px 0px 0px' },
                            cls: 'tblayout-win',
                            title: 'По дожитию',
                            autoHeight: true,
                            collapsible: true,
                            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                            fbar: {
                                xtype: 'toolbar',
                                items:
                                    [
                                        { xtype: 'splitbutton', id: 'benSurvAdd', text: 'Добавить', menu: new Ext.menu.Menu({ items: [new Ext.Action({ text: "Страхователь", handler: function () { editBeneficiary('docBenSurvList', true, true); } })] }), handler: function () { editBeneficiary('docBenSurvList', true); } },
                                        { xtype: 'button', id: 'benSurvEdit', text: 'Изменить', tooltip: 'Изменение, корректировка данных', handler: function () { editBeneficiary('docBenSurvList'); } },
                                        { xtype: 'button', id: 'benSurvDel', text: 'Удалить', handler: function () { deleteBeneficiary('docBenSurvList'); } }
                                    ]
                            },
                            items:
                                [
                                    { xtype: 'spacer', height: 8 },
                                    new Virtu.Plugins.vListView({
                                        bind: true,
                                        frame: true,
                                        store: new Ext.data.GroupingStore({ data: [], sortInfo: { field: 'number', direction: "ASC" }, reader: new Ext.data.ArrayReader({}, [{ name: 'number' }]) }),
                                        multiSelect: false,
                                        view: createBeneficiaryView(),
                                        validateRecord: validateBeneficiary,
                                        hideHeaders: false,
                                        id: 'docBenSurvList',
                                        emptyText: 'Список пуст',
                                        autoHeight: true,
                                        columnLines: true,
                                        reserveScrollOffset: true,
                                        columns: [
                                            { width: 25, sortable: true, groupable: true, menuDisabled: false, dataIndex: 'isFormValid', renderer: renderBeneficiaryErrors },
                                            { header: 'Полное имя', width: 700, dataIndex: 'docBenType', renderer: renderBeneficiary }, { width: 45, header: '%', renderer: renderBeneficiaryPct, editable: true, dataIndex: 'docBenMoneyPct' }
                                        ]
                                    })
                                ]
                        },
                        {
                            xtype: 'panel',
                            id: 'docBenDeath',
                            padding: '0px',
                            style: { margin: '4px 0px 0px 0px' },
                            cls: 'tblayout-win',
                            title: 'По смерти',
                            autoHeight: true,
                            labelWidth: 212,
                            layout: 'form',
                            collapsible: true,
                            hideLabel: false,
                            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                            fbar: {
                                xtype: 'toolbar',
                                id: 'docBenDeathTB',
                                items: [
                                    { xtype: 'button', id: 'benDeathAdd', text: 'Добавить', handler: function () { editBeneficiary('docBenDeathList', true); } },
                                    { xtype: 'button', id: 'benDeathEdit', text: 'Изменить', tooltip: 'Изменение, корректировка данных', handler: function () { editBeneficiary('docBenDeathList'); } },
                                    { xtype: 'button', id: 'benDeathDel', text: 'Удалить', handler: function () { deleteBeneficiary('docBenDeathList'); } }]
                            },
                            items:
                                [
                                    { xtype: 'spacer', height: 8 },
                                    { xtype: 'combo', bind: true, width: 580, id: 'docBenChildren', listeners: { 'select': childrenCheck }, defaultValue: false, fieldLabel: '&nbsp;Наследники по закону', editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                                    new Virtu.Plugins.vListView({
                                        bind: true,
                                        clicksToEdit: 1,
                                        frame: true,
                                        store: new Ext.data.GroupingStore({ data: [], sortInfo: { field: 'number', direction: "ASC" }, reader: new Ext.data.ArrayReader({}, [{ name: 'number' }]) }),
                                        multiSelect: false,
                                        view: createBeneficiaryView(),
                                        validateRecord: validateBeneficiary,
                                        hideHeaders: false,
                                        id: 'docBenDeathList',
                                        emptyText: 'Список пуст',
                                        autoHeight: true,
                                        columnLines: true,
                                        reserveScrollOffset: true,
                                        columns: [
                                            { width: 25, sortable: true, groupable: true, menuDisabled: false, dataIndex: 'isFormValid', renderer: renderBeneficiaryErrors },
                                            { header: 'Полное имя', width: 700, dataIndex: 'docBenType', renderer: renderBeneficiary }, { width: 45, header: '%', renderer: renderBeneficiaryPct, editable: true, dataIndex: 'docBenMoneyPct' }
                                        ]
                                    })
                                ]
                        },
                        {
                            xtype: 'panel',
                            collapsible: true,
                            style: { margin: '4px 0px 0px 0px' },
                            padding: '0',
                            cls: 'tblayout-win',
                            title: 'Вид и условие деятельности',
                            forceLayout: true,
                            layout: 'table',
                            layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                            autoHeight: true,
                            defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                            items:
                                [
                                    { xtype: 'displayfield', colspan: 3, width: 600, value: "Один или более Выгодоприобретателей являются участниками федеральных целевых программ или национальных проектов:", fieldClass: 'x-form-field' },
                                    { xtype: 'combo', bind: true, id: 'docBenBuisnessContest', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
                                ]
                        }
                    ]
            },
            {
                xtype: 'panel',
                frame: true,
                padding: '8',
                style: { margin: '4px 0px 0px 0px' },
                cls: 'tblayout-win',
                title: '',
                forceLayout: true,
                layout: 'table',
                layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 6 },
                autoHeight: true,
                defaults: { style: { margin: '0px' }, fieldClass: 'x-form-field' },
                items:
                    [
                        { xtype: 'displayfield', cellCls: 'topcell', width: 212, hidden: !IsUnderwriter, value: 'Комментарий (для продавца):' },
                        { xtype: 'textarea', width: 581, hidden: !IsUnderwriter, emptyText: '', colspan: 5, rowSpan: 2, bind: true, id: 'uwCommentSeller' },
                        { xtype: 'displayfield', cellCls: 'topcell', width: 212, hidden: IsUnderwriter, value: 'Комментарий (для Cтраховщика):' },
                        { xtype: 'textarea', width: 581, hidden: IsUnderwriter, emptyText: '', colspan: 5, rowSpan: 2, bind: true, id: 'uwCommentAdmin' }
                    ]
            }
        //,
        //           { xtype: 'panel', collapsible: true, collapsed: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', title: 'Информация о точке продаж', forceLayout: true, labelWidth: 212,
        //               autoHeight: true, layout: 'form', defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
        //               items:
        //	     [
        //                { xtype: 'textfield', anchor: '100%', frozen: true, defaultValue: SalesPointBroker, bind: true, fieldLabel: 'Посредник', readOnly: true, id: 'SalesPointBroker' },
        //                { xtype: 'textfield', anchor: '100%', frozen: true, defaultValue: SalesPointCurator, bind: true, fieldLabel: 'Куратор', readOnly: true, id: 'SalesPointCurator' },
        //                { xtype: 'textfield', anchor: '100%', frozen: true, defaultValue: SalesPointCreditOrganization, bind: true, fieldLabel: 'Кредитная организация', readOnly: true, id: 'SalesPointCreditOrganization' },
        //                { xtype: 'textfield', anchor: '100%', frozen: true, defaultValue: SalesPointSalesChannel, bind: true, fieldLabel: 'Канал продаж', readOnly: true, id: 'SalesPointSalesChannel' },
        //                { xtype: 'textfield', anchor: '100%', frozen: true, defaultValue: SalesPointSpecials, bind: true, fieldLabel: 'Спец условия', readOnly: true, id: 'SalesPointSpecials' },
        //                { xtype: 'textfield', anchor: '100%', frozen: true, defaultValue: SalesPointSalesPoint, bind: true, fieldLabel: 'Точка продаж', readOnly: true, id: 'SalesPointSalesPoint' },
        //                { xtype: 'textfield', anchor: '100%', frozen: true, defaultValue: SalesPointAuthor, bind: true, fieldLabel: 'Автор', readOnly: true, id: 'SalesPointAuthor' }
        //	     ]
        //           }
        ]
    });
}