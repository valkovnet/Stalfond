/// <reference name="MicrosoftAjax.js"/>
/// <reference path="~/Scripts/Ext/adapter/ext/ext-base.js"/>
/// <reference path="~/scripts/Ext/ext-all.js"/>
function CopyKLADRAddressBen() {
    if (!IsProject) return;
    var from = 'docBenAddress';
    var to = 'docBenRealAddress';
    Ext.getCmp(to).setValue(Ext.getCmp(from).getValue());
}
function PanelBeneficiary(isInsurerVisible) {

    var ctrls = [];
    var documentCheck = function () {

        var type = Ext.getCmp("docBenPassType").getValue();


        Ext.getCmp("docBenPassSerial").minLength = ((type == "76287A37-ADB9-4933-A78A-1E21B573B8A9") ? 3 : 4);
        Ext.getCmp("docBenPassSerial").maxLength = ((type == "76287A37-ADB9-4933-A78A-1E21B573B8A9") ? undefined : 4);
        Ext.getCmp("docBenPassNumber").minLength = ((type == "76287A37-ADB9-4933-A78A-1E21B573B8A9") ? 4 : 6);
        Ext.getCmp("docBenPassNumber").maxLength = ((type == "76287A37-ADB9-4933-A78A-1E21B573B8A9") ? undefined : 6);

        Ext.getCmp("docBenPassSerial").validate();
        Ext.getCmp("docBenPassNumber").validate();

        //  Ext.getCmp("docBenPassSerial").clearInvalid();
        //  Ext.getCmp("docBenPassNumber").clearInvalid();

    };
    var visibleCheck = function () {
        var t = Ext.getCmp('docBenType').getValue();
        var isInsuredCt = Ext.getCmp('docBenIsInsured');
        isInsuredCt.setVisible(t == 1 && isInsurerVisible);
        isInsuredCt.suspendEvents();
        if (isInsuredCt.hidden) isInsuredCt.setValue(false);
        isInsuredCt.resumeEvents();
        for (var i = 0; ctrls[i] != undefined; i++) {
            if (!ctrls[i].id) continue;
            if (!ctrls[i].bType) continue;
            var enabled = (isInsuredCt.getValue() ? false : t == ctrls[i].bType);
            Ext.getCmp(ctrls[i].id).setVisible(enabled);
            Ext.getCmp(ctrls[i].id).setDisabled(!enabled);
            Ext.getCmp(ctrls[i].id).doLayout();
        }

        var parentHidden = !Ext.getCmp('benPanelMain1').isVisible();

        var russian = Ext.getCmp('docBenNati').getValue() == 1;
        var resident = Ext.getCmp('docBenResident').getValue();

        Ext.getCmp('docBenNatiOther').setDisabled(parentHidden || russian);
        Ext.getCmp('docBenNatiOther').validate();

        Ext.getCmp('docBenNonResidentPanel').setVisible(!parentHidden && !russian);
        Ext.getCmp('docBenNonResidentPanel').setDisabled(parentHidden || russian);

        Ext.getCmp('docBenResidentPanel').setVisible(!parentHidden && russian);
        Ext.getCmp('docBenResidentPanel').setDisabled(parentHidden || !russian);

        Ext.getCmp('docBenAddress').setVisible(!parentHidden && resident);
        Ext.getCmp('docBenAddress').setDisabled(parentHidden || !resident);
        Ext.getCmp('docBenRealAddress').setVisible(!parentHidden && resident);
        Ext.getCmp('docBenRealAddress').setDisabled(parentHidden || !resident);

        Ext.getCmp('docBenForeignAddressLabel').setVisible(!parentHidden && !resident);
        Ext.getCmp('docBenForeignAddress').setVisible(!parentHidden && !resident);
        Ext.getCmp('docBenForeignAddress').setDisabled(parentHidden || resident);

    };

    ctrls =
    [
        {
            xtype: 'panel', collapsible: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', forceLayout: true, layout: 'table', layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
            autoHeight: true, defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
            items:
			    [
			        { xtype: 'displayfield', value: "Тип Выгодоприобретателя:", width: 212, fieldClass: 'x-form-field' },
                    { xtype: 'combo', allowBlank: false, defaultValue: 1, bind: true, id: 'docBenType', listeners: { 'select': visibleCheck }, colspan: 3, width: 581, editable: false, store: benTypeStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                    { xtype: 'checkbox', hidden: true, bind: true, id: 'docBenIsInsured', listeners: { 'check': visibleCheck }, cellCls: 'rightcell', ctCls: 'x-form-field', boxLabel: "Страхователь является Выгодоприобретателем", boxCls: 'x-form-field', colspan: 4 }
			    ]
        },
        {
            xtype: 'panel', hidden: true, id: 'benPanelMain1', bType: 1, collapsible: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', title: 'Выгодоприобретатель (физ. лицо)', forceLayout: true, layout: 'table', layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
            autoHeight: true, defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
            items:
			    [

                { xtype: 'displayfield', value: "ФИО:", width: 212, fieldClass: 'x-form-field' },
		        { xtype: 'textfield', width: 190, emptyText: 'Фамилия', bind: true, id: 'docBenSecond', allowBlank: false },
		        { xtype: 'textfield', width: 190, emptyText: 'Имя', bind: true, id: 'docBenFirst', allowBlank: false },
		        { xtype: 'textfield', width: 190, emptyText: 'Отчество', bind: true, id: 'docBenThird', allowBlank: false },
		        { xtype: 'displayfield', value: "Место рождения:", fieldClass: 'x-form-field' },
             	{ xtype: 'textfield', width: 582, colspan: 3, bind: true, id: 'docBenBirthPlace', allowBlank: true },
                { xtype: 'displayfield', value: "Дата рождения:", fieldClass: 'x-form-field' },
                { xtype: 'datefield', bind: true, width: 190, format: "d.m.Y", id: 'docBenBirthdate', fieldLabel: 'Дата рождения', allowBlank: false },
                { xtype: 'displayfield', cellCls: 'rightcell', value: "ИНН:", width: 189, fieldClass: 'x-form-field' },
                { xtype: 'textfield', width: 190, bind: true, id: 'docBenINN', minLength: 12, maxLength: 12, allowBlank: true },
             	{ xtype: 'displayfield', value: "Гражданство:", fieldClass: 'x-form-field' },
             	{ xtype: 'combo', defaultValue: 1, bind: true, id: 'docBenNati', listeners: { 'select': visibleCheck }, width: 190, editable: false, store: countryStore, anchor: '100%', fieldLabel: 'Гражданство', mode: 'local', typeAhead: false, triggerAction: 'all' },
             	{ xtype: 'textfield', colspan: 2, emptyText: 'Укажите гражданство', width: 386, bind: true, id: 'docBenNatiOther', allowBlank: true },
             	{ xtype: 'displayfield', value: "Резидент РФ:", fieldClass: 'x-form-field' },
             	{ xtype: 'combo', defaultValue: 1, bind: true, id: 'docBenResident', listeners: { 'select': visibleCheck }, width: 581, colspan: 3, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                new Virtu.Plugins.Address({ colspan: 4, bind: true, allowBlank: true, flatValue: true, id: 'docBenAddress', adressLabelText: "Адрес регистрации:", featureFramework: framework, columnX: [0, 216, 581], forbidCustomAddress: false }),
                new Virtu.Plugins.Address({ colspan: 4, bind: true, allowBlank: true, flatValue: true, id: 'docBenRealAddress', adressLabelText: "<table cellpadding='0' cellspacing='0' border='0'><tr><td>Фактический адрес:&nbsp;&nbsp;&nbsp;</td><td><div class='copypointer2' id='buttonAddressCopy' onclick='CopyKLADRAddressBen();'</div></td></table>", featureFramework: framework, columnX: [0, 216, 581], forbidCustomAddress: false }),
                { xtype: 'displayfield', value: "Адрес регистрации:", fieldClass: 'x-form-field', id: 'docBenForeignAddressLabel' },
             	{ xtype: 'textfield', width: 582, colspan: 3, bind: true, id: 'docBenForeignAddress', allowBlank: true },
            //             	{ xtype: 'displayfield', value: "Трудоустроен:", fieldClass: 'x-form-field' },
            //             	{ xtype: 'combo', bind: true, id: 'docBenUnemployed', width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
            //             	{ xtype: 'textfield', emptyText: 'Место работы', width: 190, bind: true, id: 'docBenWork', allowBlank: true },
            //             	{ xtype: 'textfield', emptyText: 'Должность', width: 190, bind: true, id: 'docBenWorkRank', allowBlank: true },
                { xtype: 'displayfield', value: "Контактные данные:", fieldClass: 'x-form-field' },
                { xtype: 'textfield', vtype: 'phone', plugins: new Ext.ux.plugin.FormatPhoneNumber(), emptyText: 'Телефон', width: 190, bind: true, id: 'docBenPhone', allowBlank: false },
                { xtype: 'textfield', emptyText: 'E-Mail', width: 190, colspan: 2, bind: true, id: 'docBenMail', allowBlank: true }
            //              { xtype: 'displayfield', colspan: 3, value: "Согласен на получение справочно-информационных сообщений на мой номер мобильного телефона:", fieldClass: 'x-form-field' },
            //              { xtype: 'combo', bind: true, id: 'docBenAllowInform', defaultValue: true, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
            //             	{ xtype: 'displayfield', colspan: 3, value: "Является иностранным публичным должностным лицом (его близким родственником):", fieldClass: 'x-form-field' },
            //             	{ xtype: 'combo', bind: true, id: 'docBenPublicForeignPerson', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
			    ]
        },
        {
            xtype: 'panel', hidden: true, id: 'benPanelMain2', bType: 2, collapsible: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', title: 'Выгодоприобретатель (юр. лицо)', forceLayout: true, layout: 'table', layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
            autoHeight: true, defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
            items:
	     [
             	  { xtype: 'displayfield', width: 212, value: "Полное наименование:", fieldClass: 'x-form-field' },
			      { xtype: 'textfield', colspan: 3, width: 581, bind: true, id: 'docBenOrgFullName', allowBlank: true },
			      new Virtu.Plugins.Address({ colspan: 4, bind: true, id: 'docBenOrgAddress', adressLabelText: "Адрес регистрации:", featureFramework: framework, columnX: [0, 216, 581], forbidCustomAddress: false, allowBlank: true })
	     ]
        },

        {
            xtype: 'panel', hidden: true, id: 'docBenResidentPanel', bType: 1, collapsible: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', title: 'Документ, удостоверяющий личность', forceLayout: true, layout: 'table', layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
            autoHeight: true, defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
            items:
			    [
                { xtype: 'displayfield', value: "Вид документа:", width: 212, fieldClass: 'x-form-field' },
                { xtype: 'combo', bind: true, id: 'docBenPassType', defaultValue: "2E9D005B-4D52-4BE9-972C-EA6BD9D126EC", listeners: { 'select': documentCheck }, rawValue: true, colspan: 3, width: 581, editable: false, allowBlank: true, store: documentStore2, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                { xtype: 'displayfield', value: "Данные документа:", width: 190, fieldClass: 'x-form-field' },
                { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docBenPassSerial', minLength: 4, maxLength: 4, allowBlank: false },
                { xtype: 'textfield', emptyText: 'Номер', width: 190, bind: true, id: 'docBenPassNumber', minLength: 6, maxLength: 6, allowBlank: false },
                { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: false, maxValue: new Date(), format: "d.m.Y", id: 'docBenPassDate', fieldLabel: 'Дата выдачи' },
                { xtype: 'displayfield', value: "Документ выдан:", width: 190, fieldClass: 'x-form-field' },
             	{ xtype: 'textfield', width: 386, colspan: 2, bind: true, id: 'docBenPassOrg', allowBlank: false },
             	{ xtype: 'textfield', bind: true, id: 'docBenPassOrgCode', emptyText: "Код подразделения", width: 190, fieldClass: 'x-form-field' }
			    ]
        },
        {
            xtype: 'panel', hidden: true, bType: 1, id: 'docBenNonResidentPanel', border: false, items: [
            {
                xtype: 'panel', collapsible: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', title: 'Документ, подтверждающий право на пребывание в РФ', forceLayout: true, layout: 'table', layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                autoHeight: true, defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                items:
                    [
                    { xtype: 'displayfield', value: "Вид документа:", width: 212, fieldClass: 'x-form-field' },
                    { xtype: 'combo', bind: true, id: 'docBenVisaType', rawValue: true, colspan: 3, width: 581, editable: false, store: visaStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
                    { xtype: 'displayfield', value: "Данные документа:", width: 190, fieldClass: 'x-form-field' },
                    { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docBenVisaSerial', allowBlank: true },
                    { xtype: 'textfield', emptyText: 'Номер', colspan: 2, width: 190, bind: true, id: 'docBenVisaNumber', allowBlank: true },
                    { xtype: 'displayfield', value: "Дата начала срока действия:", width: 190, fieldClass: 'x-form-field' },
                    { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: true, format: "d.m.Y", id: 'docBenVisaDateStart', allowBlank: true },
                    { xtype: 'displayfield', value: "Дата окончания срока:", cellCls: 'rightcell', width: 190, fieldClass: 'x-form-field' },
                    { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, allowBlank: true, format: "d.m.Y", id: 'docBenVisaDateEnd', allowBlank: true }
                    ]
            },
            {
                xtype: 'panel', collapsible: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', title: 'Данные миграционной карты', forceLayout: true, layout: 'table', layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
                autoHeight: true, defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
                items:
                    [
                    { xtype: 'displayfield', value: "Данные документа:", width: 212, fieldClass: 'x-form-field' },
                    { xtype: 'textfield', emptyText: 'Серия', width: 190, bind: true, id: 'docBenMigrationSerial', allowBlank: true },
                    { xtype: 'textfield', emptyText: 'Номер', colspan: 2, width: 190, bind: true, id: 'docBenMigrationNumber', allowBlank: true },
                    { xtype: 'displayfield', value: "Дата начала срока пребывания:", width: 190, fieldClass: 'x-form-field' },
                    { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, format: "d.m.Y", id: 'docBenMigrationDateStart', allowBlank: true },
                    { xtype: 'displayfield', value: "Дата окончания срока:", cellCls: 'rightcell', width: 190, fieldClass: 'x-form-field' },
                    { xtype: 'datefield', emptyText: 'Дата', bind: true, width: 190, format: "d.m.Y", id: 'docBenMigrationDateEnd', allowBlank: true }
                    ]
            }]
        },
        {
            xtype: 'panel', hidden: true, id: 'benPanelBuisness', bType: 1, collapsible: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', title: 'Вид и условие деятельности', forceLayout: true, layout: 'table', layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
            autoHeight: true, defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
            items:
			    [
             	{ xtype: 'displayfield', colspan: 3, width: 600, value: "Действует в интересах (к выгоде) иностранного публичного должностного лица:", fieldClass: 'x-form-field' },
             	{ xtype: 'combo', bind: true, id: 'docBenBuisnessAct', defaultValue: '0', width: 190, editable: false, store: evidenceStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
             	{ xtype: 'displayfield', colspan: 3, width: 600, value: "Является руководителем или учредителем общественной или религиозной организации (объединения), благотворительного фонда, иностранной некоммерческой неправительственной организации:", fieldClass: 'x-form-field' },
             	{ xtype: 'combo', bind: true, id: 'docBenBuisnessBoss', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
             	{ xtype: 'displayfield', colspan: 3, width: 600, value: "Является резидентом особой экономической зоны:", fieldClass: 'x-form-field' },
             	{ xtype: 'combo', bind: true, id: 'docBenBuisnessEco', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' },
             	{ xtype: 'displayfield', colspan: 3, value: "Является иностранным публичным должностным лицом (его близким родственником):", fieldClass: 'x-form-field' },
             	{ xtype: 'combo', bind: true, id: 'docBenPublicForeignPerson', defaultValue: false, width: 190, editable: false, store: yesnoStore, anchor: '100%', mode: 'local', typeAhead: false, triggerAction: 'all' }
            // { xtype: 'displayfield', colspan: 3, value: "Осуществляемая деятельность не соответствует видам и условиям, перечисленным выше:", fieldClass: 'x-form-field' },
            // { xtype: 'checkbox', bind: true, id: 'docBenBuisnessOther', readOnly: true, frozen: true, defaultValue: true, width: 190, editable: false, anchor: '100%'} // TODO

			    ]
        },
      {
          xtype: 'panel', collapsible: true, style: { margin: '4px 0px 0px 0px' }, padding: '8', cls: 'tblayout-win', title: 'Доля страховой суммы', forceLayout: true, layout: 'table', layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 },
          autoHeight: true, defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
          items:
                [
			        { xtype: 'displayfield', width: 212, value: "Доля страховой суммы, %:", fieldClass: 'x-form-field' },
			        { xtype: 'numberfield', width: 190, emptyText: 'Число', bind: true, minValue: 10, maxValue: 100, id: 'docBenMoneyPct', allowBlank: false }
                ]
      }
    ];
    return ctrls;
}
