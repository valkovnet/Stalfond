/// <reference name="MicrosoftAjax.js"/>

function FormPayment(aPrintPayment) {


    return new Ext.form.FormPanel({ autoHeight: true, layout: 'fit', padding: '5', border: false, xtype: 'form', title: "Квитанция",
        labelWidth: 500, headerCssClass: 'headerEXT', defaults: { style: { margin: '0px 0px 0px 0px' }, fieldClass: 'x-form-field' },
        items: [
         { xtype: 'panel', frame: true, padding: '8', cls: 'tblayout-win', title: '', forceLayout: true,
             layout: 'table', fbar: { xtype: 'toolbar', items: [aPrintPayment]
             }, layoutConfig: { tableAttrs: { cellspacing: 3 }, columns: 4 }, autoHeight: true, defaults: { style: { margin: '0px' }, fieldClass: 'x-form-field' },
             items: [
             	  { xtype: 'displayfield', width: 212, value: "Дата квитанции:", fieldClass: 'x-form-field' },
             	  { xtype: 'datefield', defaultValue: new Date(), bind: true, width: 190, allowBlank: false, format: "d.m.Y", id: 'docPaymentDate' },
                  { xtype: 'displayfield', width: 190, cellCls: 'rightcell', value: "Общая сумма взносов:", fieldClass: 'x-form-field' },
             	  { xtype: 'FormatNumberField', cls: 'rightcell', readOnly: true, width: 190, frozen: true, emptyText: '(авто)', bind: true, id: 'Premium', allowBlank: false },
             	  { xtype: 'displayfield', width: 190, hidden: true, disabled: true, value: "Номер квитанции:", fieldClass: 'x-form-field' },
             	  { xtype: 'textfield', width: 190, hidden: true, disabled: true, frozen: true, emptyText: '', bind: true, id: 'PaymentTicket', allowBlank: false },
             	  { xtype: 'displayfield', hidden: true, cellCls: 'rightcell', value: "Сумма выплат:", fieldClass: 'x-form-field' },
             	  { xtype: 'textfield', hidden: true, cls: 'rightcell', readOnly: true, width: 190, frozen: true, emptyText: '(авто)', bind: true, id: 'Payment', allowBlank: false }
         ]}]
    });
}