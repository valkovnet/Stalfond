/// <reference name="MicrosoftAjax.js"/>
/// <reference path="~/Scripts/Ext/adapter/ext/ext-base.js"/>
/// <reference path="~/scripts/Ext/ext-all.js"/>

function FormCalc(aCalc) {
    // Валидаторы
    var calcPaymentShortCheck = function(o, e) {
        if (!IsProject) return;
        e = Ext.getCmp('calcPaymentShort').getValue();
        Ext.getCmp('calcPaymentDuration').setValue(undefined);
        Ext.getCmp('calcPaymentDuration').setDisabled(!e);
        Ext.getCmp('calcPaymentDuration').allowBlank = !e;
        Ext.getCmp('calcPaymentDuration').minValue = e ? 1 : undefined;
        Ext.getCmp('calcPaymentDuration').maxValue = e ? 17 : undefined; //Ext.getCmp('calcDuration').getValue() : undefined;
        Ext.getCmp('calcPaymentDuration').validate();

    };

    var calcDurationCheck = function(o, e) {
        if (!IsProject) return;
        Ext.getCmp('calcPaymentDuration').minValue = 1;
        Ext.getCmp('calcPaymentDuration').maxValue = Ext.getCmp('calcDuration').getValue();
        Ext.getCmp('calcPaymentDuration').validate();
    };

    var calcTypeCheck = function(o, e) {
        if (!IsProject) {
            return;
        }

        if (e) {
            e = e.inputValue;
            Ext.getCmp('sumTotal').setDisabled(e != '2');
            Ext.getCmp('premTotal').setDisabled(e != '1');
            Ext.getCmp('sumTotal').emptyText = e != '2' ? '' : 'Укажите страховую сумму';
            Ext.getCmp('premTotal').emptyText = e != '1' ? '' : 'Укажите страховой взнос';
            Ext.getCmp('sumTotal').reset();
            Ext.getCmp('premTotal').reset();
            Ext.getCmp('sumTotal').validate();
            Ext.getCmp('premTotal').validate();
            riskSharedCheck();
        }
    };

    function validateMinSums(v) {
        if (IsProject) {
            var premium = v;

            if (premium) {
                var rur = Ext.getCmp("calcCurrency").getValue() == "7D484684-B8B7-4F46-BC3C-0E054F764845";

                var rurValue = Ext.getCmp("calcPaymentFreq").store.getAt(Ext.getCmp("calcPaymentFreq").store.find("field1", Ext.getCmp("calcPaymentFreq").getValue())).data.field3;
                var curRate = Ext.getCmp("calcCurrency").store.getAt(Ext.getCmp("calcCurrency").store.find("field1", Ext.getCmp("calcCurrency").getValue())).data.field3;
                Ext.getCmp("calcPaymentFreq").store.getAt(Ext.getCmp("calcPaymentFreq").store.find("field1", Ext.getCmp("calcPaymentFreq").getValue())).data.field4 = rurValue / curRate;


                var rateSum = Ext.getCmp("calcPaymentFreq").store.getAt(Ext.getCmp("calcPaymentFreq").store.find("field1", Ext.getCmp("calcPaymentFreq").getValue()));
                var checksum = parseInt(rateSum !== undefined ? (rur ? rateSum.data.field3 : rateSum.data.field4) : "0");
                var sum = parseInt(premium.replaceAll(" ", "") || "0");

                var error = "Взнос не может быть менее " + checksum;

                if (!sum || sum < checksum) {
                    return error;
                }
            }
        }

        return true;
    }

    var currencySelect = function(o, e) {
        var v = Ext.getCmp("calcCurrency").getValue();

        var rur = v == "7D484684-B8B7-4F46-BC3C-0E054F764845";

        Ext.getCmp("calcCurrencyRates").setVisible(!rur);
        Ext.getCmp("calcCurrencyRates").getEl().up('.x-form-item').setDisplayed(!rur);
        Ext.getCmp("calcPremiumRUR").setVisible(!rur);
        Ext.getCmp("calcPremiumRUR").getEl().up('.x-form-item').setDisplayed(!rur);

        var rurValue = Ext.getCmp("calcPaymentFreq").store.getAt(Ext.getCmp("calcPaymentFreq").store.find("field1", Ext.getCmp("calcPaymentFreq").getValue())).data.field3;
        var curRate = Ext.getCmp("calcCurrency").store.getAt(Ext.getCmp("calcCurrency").store.find("field1", Ext.getCmp("calcCurrency").getValue())).data.field3;
        Ext.getCmp("calcPaymentFreq").store.getAt(Ext.getCmp("calcPaymentFreq").store.find("field1", Ext.getCmp("calcPaymentFreq").getValue())).data.field4 = rurValue / curRate;


        Ext.getCmp('PremiumText').validate();
        Ext.getCmp('premTotal').validate();

        if (IsProject) Ext.getCmp('calcIncome').setDisabled(!rur);

        if (!rur) Ext.getCmp('calcIncome').setValue("1");

        incomeSelect();

        if (IsProject) {
            UpdateQuote(undefined, undefined);
        }
    };

    var riskSharedCheck = function(o, e) {
        if (!IsProject) {
            return;
        }

        var ctrls = [
            [Ext.getCmp('riskInvalid1'), Ext.getCmp('riskInvalid1Sum'), Ext.getCmp('riskInvalid1Coef')],
            [Ext.getCmp('riskInvalid2'), Ext.getCmp('riskInvalid2Sum'), Ext.getCmp('riskInvalid2Coef')],
            [Ext.getCmp('riskInvalid3'), Ext.getCmp('riskInvalid3Sum'), Ext.getCmp('riskInvalid3Coef')],
            [Ext.getCmp('riskAccidentDeath'), Ext.getCmp('riskAccidentDeathSum'), Ext.getCmp('riskAccidentDeathCoef')],
            [Ext.getCmp('riskInjuries'), Ext.getCmp('riskInjuriesSum'), Ext.getCmp('riskInjuriesCoef')],
            [Ext.getCmp('riskAccidentHospital'), Ext.getCmp('riskAccidentHospitalSum'), Ext.getCmp('riskAccidentHospitalCoef')],
            [Ext.getCmp('riskSOSZHV'), Ext.getCmp('riskSOSZHVSum'), Ext.getCmp('riskSOSZHVCoef')]
        ];

        var chBox;

        for (var i = 0; ctrls[i] != undefined; i++) {
            var value = !ctrls[i][0].getValue();
            ctrls[i][1].setDisabled(true); //ctrls[i][1].setDisabled(value);         множители всегда задизаблены
            // ctrls[i][2].setDisabled(value || !IsUnderwriter); // Андерайтинг пока не планируется
            ctrls[i][2].setDisabled(value || (!IsUnderwriter && !IsAdmin));
            ctrls[i][1].validate();
            ctrls[i][2].validate();
        }
        sumTotalCheck();
    };

    var sumTotalCheck = function(o, e) {
        // проверка введённых значений суммы или премии
        // всегда undefined
    };

    var multiRiskCheck = function(o, e) {
        setInsured2IsInsurer(checkInsured2IsInsurerCondition());

        if (!IsProject || IsLoading) {
            return;
        }

        riskSharedCheck();

        if (e && o.id == 'riskAccidentHospital')
            Ext.Msg.alert('Внимание!', 'Покупатель уведомлен, что <b>наступление инвалидности у ребенка НЕ считается страховым событием до 3-х летнего возраста</b>');

    };

    var singleRiskCheck = function(o, e) {
        setInsured2IsInsurer(checkInsured2IsInsurerCondition());

        if (!IsProject) {
            return;
        }

        var ctrls = [
            [Ext.getCmp('riskInvalid1')],
            [Ext.getCmp('riskInvalid2')],
            [Ext.getCmp('riskInvalid3')]
        ];

        for (var i = 0; ctrls[i] != undefined; i++) {
            ctrls[i][0].suspendEvents();
            if (e && o != ctrls[i][0]) ctrls[i][0].setValue(false);
            ctrls[i][0].resumeEvents();
        }

        riskSharedCheck();
    };

    

    function age2Changed() {
        var birthDate = Ext.getCmp('calc2Age').getValue();
        Ext.getCmp('docInsured2Birthdate').setValue(birthDate);

    }

    function ageChanged() {
        var birthDate = Ext.getCmp('calcAge').getValue();
        Ext.getCmp('docInsuredBirthdate').setValue(birthDate);
    }

    function sumChanged() {
        var sum = Ext.getCmp('calcPayment').getValue();
        Ext.getCmp('Payment').setValue(sum);
    }

    function premChanged() {
        var prem = Ext.getCmp('calcPremium').getValue();
        Ext.getCmp('Premium').setValue(prem);
    }

    function insured2Check() {

        var value = Ext.getCmp('calcInsured2Enable').getValue();

        Ext.getCmp('calc2Gender').getEl().up('.x-form-item').setDisplayed(value);
        Ext.getCmp('calc2Age').getEl().up('.x-form-item').setDisplayed(value);

        Ext.getCmp('calc2Gender').setVisible(value);
        Ext.getCmp('calc2Age').setVisible(value);
        Ext.getCmp('calc2Age').allowBlank = !value;

        insured2Update();

        if (!IsProject) return;

        Ext.getCmp('docTOSSecond').setDisabled(!value);

        value = value && Ext.getCmp('calcPaymentFreq').getValue() != '0';

        if (riskInvalid1) {
            if (!value) Ext.getCmp("riskInvalid1").setValue(false);
            Ext.getCmp("riskInvalid1").setDisabled(!value);
            Ext.getCmp("riskInvalid1").frozen = !value;
        }

        if (riskAccidentDeath) {
            if (!value) Ext.getCmp("riskAccidentDeath").setValue(false);
            Ext.getCmp("riskAccidentDeath").setDisabled(!value);
            Ext.getCmp("riskAccidentDeath").frozen = !value;
        }
    }

    function incomeSelect() {
        if (!IsProject) return;
        //        Ext.getCmp('calcFond').setDisabled(Ext.getCmp('calcIncome').getValue() != "2");
        //        if (Ext.getCmp('calcIncome').getValue() != "2") {
        //            Ext.getCmp('calcFond').setValue("10165FBF-203B-4A48-8913-5C2B91B1B1DA");
        //        }

    }

    // валидация срока страхования

    function validateCalcDuration(v) {
        var effectiveDate = new Date(); //Ext.getCmp('documentDate').getValue();
        var birthDate = Ext.getCmp('calcAge').getValue();


        if (DateDiff.inYears(effectiveDate, birthDate) + Number(v) >= maxChildAgeForInsurance) {
            return 'Возраст застрахованного на дату окончания действия Договора должен быть меньше или равен 23 годам. ';
        }

        return true;
    }

    return new Ext.form.FormPanel({
        autoHeight: true,
        layout: 'fit',
        padding: '5',
        border: false,
        xtype: 'form',
        title: "Калькулятор",
        labelWidth: 500,
        headerCssClass: 'headerEXT',
        defaults: {
            style: { margin: '0px 0px 0px 0px' },
            fieldClass: 'x-form-field'
        },
        items: [
            {
                xtype: 'fieldset',
                cls: 'tblayout-win',
                title: 'Обьект расчёта',
                forceLayout: true,
                layout: 'form',
                autoHeight: true,
                defaults: {
                    style: { margin: '0px 0px 0px 0px' },
                    fieldClass: 'x-form-field'
                },
                items:
                [
                    {
                        xtype: 'combo',
                        bind: true,
                        id: 'calcGender',
                        editable: false,
                        fieldLabel: 'Пол застрахованного лица - ребёнка',
                        anchor: '100%',
                        allowBlank: false,
                        store: sexStore,
                        mode: 'local',
                        typeAhead: false,
                        triggerAction: 'all',
                        defaultValue: "1"
                    },
                    {
                        xtype: 'datefield',
                        bind: true,
                        id: 'calcAge',
                        listeners: { 'change': ageChanged },
                        defaultValue: undefined /* maxAgeDate */,
                        minValue: minAgeChildDate,
                        maxValue: maxAgeChildDate,
                        allowBlank: false,
                        format: "d.m.Y",
                        fieldLabel: 'Дата рождения',
                        anchor: '100%',
                        allowBlank: false
                    },
                    {
                        xtype: 'combo',
                        bind: true,
                        id: 'calcInsured2Enable',
                        editable: false,
                        store: yesnoStore,
                        anchor: '100%',
                        defaultValue: false,
                        fieldLabel: 'Дополнительное Застрахованное лицо',
                        defaultValue: true,
                        mode: 'local',
                        typeAhead: false,
                        triggerAction: 'all',
                        listeners: {
                            'select': insured2Check
                        }
                    },
                    {
                        xtype: 'combo',
                        bind: true,
                        id: 'calc2Gender',
                        editable: false,
                        fieldLabel: 'Пол дополнительного застрахованного лица',
                        anchor: '100%',
                        allowBlank: false,
                        store: sexStore,
                        mode: 'local',
                        typeAhead: false,
                        triggerAction: 'all',
                        defaultValue: "1"
                    },
                    {
                        xtype: 'datefield',
                        bind: true,
                        id: 'calc2Age',
                        listeners: { 'change': age2Changed },
                        defaultValue: undefined /* maxAgeDate */,
                        minValue: minAgeDate,
                        maxValue: maxAgeDate,
                        allowBlank: false,
                        format: "d.m.Y",
                        fieldLabel: 'Дата рождения',
                        anchor: '100%',
                        allowBlank: false
                    },
                    {
                        xtype: 'combo',
                        bind: true,
                        id: 'calcDuration',
                        forceSelection: true,
                        editable: true,
                        fieldLabel: 'Срок страхования (лет)',
                        validator: validateCalcDuration,
                        anchor: '100%',
                        allowBlank: false,
                        store: durationStore,
                        mode: 'local',
                        typeAhead: false,
                        triggerAction: 'all',
                        defaultValue: "1",
                        listeners: {
                            'select': calcPaymentShortCheck
                        }
                    },
                    {
                        xtype: 'combo',
                        bind: true,
                        id: 'calcPaymentFreq',
                        rawValue: true,
                        editable: false,
                        fieldLabel: 'Периодичность уплаты взносов',
                        defaultValue: '1',
                        anchor: '100%',
                        allowBlank: false,
                        mode: 'local',
                        typeAhead: false,
                        triggerAction: 'all',
                        store: rateStore,
                        listeners: {
                            'select': insured2Check
                        }
                    },
                    {
                        xtype: 'combo',
                        bind: true,
                        id: 'calcPaymentShort',
                        editable: false,
                        store: yesnoStore,
                        anchor: '100%',
                        defaultValue: false,
                        fieldLabel: 'Сокращенный период уплаты взносов',
                        mode: 'local',
                        typeAhead: false,
                        triggerAction: 'all',
                        listeners: {
                            'select': calcPaymentShortCheck
                        }
                    },
                    {
                        xtype: 'numberfield',
                        disabled: true,
                        bind: true,
                        id: 'calcPaymentDuration',
                        fieldLabel: 'Срок уплаты взносов',
                        anchor: '100%',
                        allowBlank: true
                    },
                    {
                        xtype: 'combo',
                        frozen: true,
                        disabled: false,
                        mode: 'local',
                        typeAhead: false,
                        editable: false,
                        triggerAction: 'all',
                        id: 'calcCurrency',
                        store: CurrencyRates,
                        bind: true,
                        readOnly: !calcCurrencyAllow,
                        fieldLabel: 'Валюта',
                        anchor: '100%',
                        allowBlank: false,
                        listeners: { 'select': currencySelect },
                        defaultValue: "7D484684-B8B7-4F46-BC3C-0E054F764845"
                    },
                    {
                        xtype: 'textfield',
                        frozen: true,
                        disabled: false,
                        id: 'calcCurrencyRates',
                        bind: true,
                        readOnly: true,
                        fieldLabel: 'Курс валют',
                        anchor: '100%',
                        allowBlank: false,
                        defaultValue: CurrencyRatesText
                    },
                    { xtype: 'combo', bind: true, id: 'calcIncome', editable: false, fieldLabel: 'Получение дохода', anchor: '100%', defaultValue: "1", allowBlank: false, mode: 'local', typeAhead: false, triggerAction: 'all', listeners: { 'select': incomeSelect }, store: incomeStore }
                ]
            },
            {
                xtype: 'fieldset',
                cls: 'tblayout-win',
                title: 'Предмет расчёта',
                forceLayout: true,
                layout: 'column',
                autoHeight: true,
                defaults: {
                    style: { margin: '0px 0px 0px 0px' },
                    fieldClass: 'x-form-field'
                },
                items:
                [
                    {
                        xtype: 'radiogroup',
                        columnWidth: .63,
                        triggerAction: 'all',
                        editable: false,
                        hideLabel: true,
                        anchor: '100%',
                        allowBlank: false,
                        listeners: {
                            'change': calcTypeCheck
                        },
                        bind: true,
                        id: 'calcType',
                        defaultValue: '2',
                        itemCls: 'x-check-group',
                        columns: 1,
                        defaultType: 'radio',
                        items: [{ xtype: 'radio', name: 'calcType', inputValue: '1', boxLabel: 'Страховая сумма' }, {
                            xtype: 'radio',
                            name: 'calcType',
                            inputValue: '2',
                            boxLabel: 'Страховой взнос'
                        }]
                    },
                    {
                        xtype: 'container',
                        layout: 'form',
                        defaults: {
                            hideLabel: true,
                            anchor: '100%'
                        },
                        autoHeight: true,
                        columnWidth: .37,
                        items: [
                            {
                                xtype: 'FormatNumberField',
                                emptyText: '',
                                disabled: true,
                                allowBlank: false,
                                validator: validateMinSums,
                                listeners: { 'valid': sumTotalCheck },
                                bind: true,
                                id: 'premTotal',
                                width: 100,
                                fieldLabel: ''
                            },
                            { xtype: 'FormatNumberField', emptyText: '', disabled: true, allowBlank: false, listeners: { 'valid': sumTotalCheck }, bind: true, id: 'sumTotal', width: 100, fieldLabel: '' }
                        ]
                    }
                ]
            },
            {
                xtype: 'fieldset',
                cls: 'tblayout-win',
                id: 'risks',
                title: 'Обязательные риски',
                layout: 'column',
                defaults: {
                    style: { margin: '0px 0px 0px 0px' },
                    fieldClass: 'x-form-field'
                },
                items: [
                    {
                        xtype: 'spacer',
                        columnWidth: .50,
                        height: 22
                    },
                    {
                        xtype: 'spacer',
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'displayfield',
                        cls: 'v-field-gray',
                        columnWidth: .19,
                        value: '&nbsp;&nbsp;множитель суммы'
                    },
                    {
                        xtype: 'displayfield',
                        cls: 'v-field-gray',
                        columnWidth: .19,
                        value: '&nbsp;&nbsp;коэф. андеррайтера'
                    },
                    {
                        xtype: 'checkbox',
                        ctCls: 'x-form-field',
                        columnWidth: .50,
                        defaultValue: true,
                        frozen: true,
                        bind: true,
                        disabled: true,
                        id: 'riskSurvial',
                        width: 510,
                        boxLabel: 'Дожитие Застрахованного лица',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 1,
                        bind: true,
                        disabled: true,
                        frozen: true,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        id: 'riskSurvialSum',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'numberfield',
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        bind: true,
                        disabled: true,
                        frozen: true,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        id: 'riskSurvialCoef',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'checkbox',
                        ctCls: 'x-form-field',
                        columnWidth: .50,
                        defaultValue: true,
                        frozen: true,
                        bind: true,
                        disabled: true,
                        id: 'riskDeath',
                        width: 510,
                        boxLabel: 'Смерть Застрахованного лица от любых причин',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 1,
                        bind: true,
                        disabled: true,
                        frozen: true,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        id: 'riskDeathSum',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    { xtype: 'numberfield', disabled: true, minValue: 0.01, defaultValue: 1, decimalSeparator: ',', maxValue: 10, bind: true, disabled: true, frozen: true, cls: 'v-field', ctCls: 'x-form-field', id: 'riskDeathCoef', style: { margin: '0px 0px 0px 8px' }, columnWidth: .19 }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Дополнительные риски',
                cls: 'tblayout-win',
                defaults: {
                    style: { margin: '0px 0px 0px 0px' },
                    fieldClass: 'x-form-field'
                },
                layout: 'column',
                items: [
                    {
                        xtype: 'spacer',
                        columnWidth: .50,
                        height: 22
                    },
                    {
                        xtype: 'spacer',
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'displayfield',
                        cls: 'v-field-gray',
                        columnWidth: .19,
                        value: '&nbsp;&nbsp;множитель суммы'
                    },
                    {
                        xtype: 'displayfield',
                        cls: 'v-field-gray',
                        columnWidth: .19,
                        value: '&nbsp;&nbsp;коэф. андеррайтера'
                    },
                    {
                        xtype: 'checkbox',
                        hidden: !riskInjuries,
                        frozen: !riskInjuries,
                        disabled: !riskInjuries,
                        listeners: { 'check': multiRiskCheck },
                        ctCls: 'x-form-field',
                        defaultValue: true,
                        columnWidth: .50,
                        bind: true,
                        id: 'riskInjuries',
                        width: 510,
                        boxLabel: 'Телесные повреждения Застрахованного лица в результате НС',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        hidden: !riskInjuries,
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskInjuries,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskInjuriesSum',
                        allowBlank: false,
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskInjuries,
                        disabled: IsUnderwriter ? false : true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskInjuriesCoef',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'checkbox',
                        hidden: !riskAccidentHospital,
                        frozen: !riskAccidentHospital,
                        defaultValue: true,
                        disabled: !riskAccidentHospital,
                        listeners: { 'check': multiRiskCheck },
                        ctCls: 'x-form-field',
                        columnWidth: .50,
                        bind: true,
                        id: 'riskAccidentHospital',
                        width: 510,
                        boxLabel: 'Инвалидность Застрахованного лица (ребенок-инвалид)',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        hidden: !riskAccidentHospital,
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskAccidentHospital,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskAccidentHospitalSum',
                        allowBlank: false,
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskAccidentHospital,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskAccidentHospitalCoef',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'checkbox',
                        hidden: !riskSOSZHV,
                        frozen: !riskSOSZHV,
                        disabled: !riskSOSZHV,
                        listeners: { 'check': multiRiskCheck },
                        ctCls: 'x-form-field',
                        columnWidth: .50,
                        bind: true,
                        id: 'riskSOSZHV',
                        width: 510,
                        boxLabel: 'СОЗ и ХВ',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        hidden: !riskSOSZHV,
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskSOSZHV,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskSOSZHVSum',
                        allowBlank: false,
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskSOSZHV,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskSOSZHVCoef',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'checkbox',
                        hidden: !riskAccidentDeath,
                        frozen: !riskAccidentDeath,
                        disabled: !riskAccidentDeath,
                        defaultValue: true,
                        listeners: { 'check': multiRiskCheck },
                        ctCls: 'x-form-field',
                        columnWidth: .50,
                        bind: true,
                        id: 'riskAccidentDeath',
                        width: 510,
                        boxLabel: 'Смерть Доп.Застрахованного лица от любых причин',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        hidden: !riskAccidentDeath,
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskAccidentDeath,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskAccidentDeathSum',
                        allowBlank: false,
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskAccidentDeath,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskAccidentDeathCoef',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'checkbox',
                        hidden: !riskInvalid1,
                        frozen: !riskInvalid1,
                        disabled: !riskInvalid1,
                        defaultValue: true,
                        listeners: { 'check': singleRiskCheck },
                        bind: true,
                        ctCls: 'x-form-field',
                        id: 'riskInvalid1',
                        columnWidth: .50,
                        boxLabel: 'Инвалидность Доп.Застрахованного лица (1 гр.) от любых причин',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        hidden: !riskInvalid1,
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskInvalid1,
                        disabled: true,
                        minValue: 1,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskInvalid1Sum',
                        allowBlank: false,
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskInvalid1,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        ctCls: 'x-form-field',
                        bind: true,
                        id: 'riskInvalid1Coef',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'checkbox',
                        hidden: !riskInvalid2,
                        frozen: !riskInvalid2,
                        disabled: !riskInvalid2,
                        listeners: { 'check': singleRiskCheck },
                        bind: true,
                        ctCls: 'x-form-field',
                        id: 'riskInvalid2',
                        columnWidth: .50,
                        boxLabel: 'Инвалидность I, II по любой причине',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        hidden: !riskInvalid2,
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskInvalid2,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        bind: true,
                        id: 'riskInvalid2Sum',
                        allowBlank: false,
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskInvalid2,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        bind: true,
                        ctCls: 'x-form-field',
                        id: 'riskInvalid2Coef',
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    {
                        xtype: 'checkbox',
                        hidden: !riskInvalid3,
                        frozen: !riskInvalid3,
                        disabled: !riskInvalid3,
                        listeners: { 'check': singleRiskCheck },
                        bind: true,
                        ctCls: 'x-form-field',
                        id: 'riskInvalid3',
                        columnWidth: .50,
                        boxLabel: 'Инвалидность I, II, III в результате НС',
                        hideLabel: true
                    },
                    {
                        xtype: 'spacer',
                        hidden: !riskInvalid3,
                        columnWidth: .12,
                        height: 22
                    },
                    {
                        xtype: 'numberfield',
                        hidden: !riskInvalid3,
                        disabled: true,
                        minValue: 0.01,
                        defaultValue: 1,
                        decimalSeparator: ',',
                        maxValue: 10,
                        cls: 'v-field',
                        bind: true,
                        id: 'riskInvalid3Sum',
                        allowBlank: false,
                        style: { margin: '0px 0px 0px 8px' },
                        columnWidth: .19
                    },
                    { xtype: 'numberfield', hidden: !riskInvalid3, disabled: true, minValue: 0.01, defaultValue: 1, decimalSeparator: ',', maxValue: 10, cls: 'v-field', bind: true, ctCls: 'x-form-field', id: 'riskInvalid3Coef', style: { margin: '0px 0px 0px 8px' }, columnWidth: .19 }
                ]
            },
            {
                xtype: 'fieldset',
                cls: 'tblayout-win',
                id: 'objectResults',
                title: 'Результат',
                forceLayout: true,
                layout: 'form',
                autoHeight: true,
                defaults: {
                    style: { margin: '0px 0px 0px 0px' },
                    fieldClass: 'x-form-field'
                },
                items: [
                    {
                        xtype: 'panel',
                        style: {
                            margin: '0px 0px 4px 0px'
                        },
                        border: false,
                        layout: 'table',
                        layoutConfig: {
                            tableAttrs: { cellspacing: 3 },
                            columns: 4
                        },
                        defaults: {
                            style: { margin: '0px 0px 0px 0px' },
                            fieldClass: 'x-form-field'
                        },
                        items:
                        [
                            {
                                xtype: 'displayfield',
                                style: { margin: '0px 0px 0px 0px' },
                                width: 212,
                                fieldClass: 'x-form-field itog14label',
                                value: 'Общий взнос по договору:'
                            },
                            {
                                xtype: 'spacer',
                                width: 280
                            },
                            {
                                xtype: 'textfield',
                                bind: true,
                                cls: 'itog14',
                                width: 205,
                                style: { margin: '4px' },
                                id: 'PremiumText',
                                validator: validateMinSums,
                                readOnly: true,
                                frozen: true,
                                allowBlank: true
                            }, aCalc
                        ]
                    },
                    /*Premium*/{
                        xtype: 'textfield',
                        hidden: true,
                        hideLabel: true,
                        frozen: true,
                        readOnly: true,
                        bind: true,
                        id: 'calcPremium',
                        fieldClass: 'rightcell',
                        emptyText: '',
                        fieldLabel: 'Страховой взнос',
                        anchor: '100%',
                        listeners: {
                            'valid': premChanged
                        }
                    },
                    {
                        xtype: 'textfield',
                        frozen: true,
                        readOnly: true,
                        hidden: false,
                        hideLabel: false,
                        bind: true,
                        id: 'calcPremiumLife',
                        cls: 'rightcell',
                        emptyText: '',
                        fieldLabel: 'Страховой взнос по обязательным рискам',
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        frozen: true,
                        readOnly: true,
                        hidden: false,
                        hideLabel: false,
                        bind: true,
                        id: 'calcPremiumNonLife',
                        cls: 'rightcell',
                        emptyText: '',
                        fieldLabel: 'Страховой взнос по дополнительным рискам',
                        anchor: '100%'
                    },
                    /*Payment*/{
                        xtype: 'textfield',
                        frozen: true,
                        readOnly: true,
                        bind: true,
                        id: 'calcPayment',
                        cls: 'rightcell',
                        emptyText: '',
                        fieldLabel: 'Страховая сумма',
                        anchor: '100%',
                        listeners: {
                            'valid': sumChanged
                        }
                    },
                    {
                        xtype: 'textfield',
                        frozen: true,
                        readOnly: true,
                        bind: true,
                        id: 'calcPaymentCount',
                        cls: 'rightcell',
                        emptyText: '',
                        fieldLabel: 'Число платежей',
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        frozen: true,
                        readOnly: true,
                        bind: true,
                        id: 'calcPremiumRUR',
                        cls: 'rightcell',
                        emptyText: '',
                        fieldLabel: 'Сумма взноса в рублях',
                        anchor: '100%'
                    },
                    { xtype: 'textfield', frozen: true, readOnly: true, hidden: true, hideLabel: true, bind: true, id: 'calcPaymentRaw', cls: 'rightcell', emptyText: '', fieldLabel: '', anchor: '100%' }
                ]
            }
        ]
    });


}