/*
 * File: app/view/MainView.js
 */
var genderStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'name'],
    data: [
        { "id": "М", "name": "Мужской" },
        { "id": "Ж", "name": "Женский" }
    ]
});

Ext.apply(Ext.form.VTypes, { 
    'phoneText': 'Неверный номер. Введите номер в формате +7 (XXX) XXXXXXX.', 
    'phoneMask': /[\-\+0-9\(\)\s\.Ext]/, 
    'phoneRe': /^(\({1}[0-9]{3}\){1}\s{1})([0-9]{3}[-]{1}[0-9]{4})$|^(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}$|^Ext. [0-9]+$/, 
    'phone': function (v) {
        return this.phoneRe.test(v); 
    }
});

// Function to format a phone number
Ext.apply(Ext.util.Format, {
    phoneNumber: function(value) {
        var phoneNumber = value.replace(/\./g, '').replace(/-/g, '').replace(/[^0-9]/g, '');
        
        if (phoneNumber != '' && phoneNumber.length == 10) {
            return '(' + phoneNumber.substr(0, 3) + ') ' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6, 4);
        } else {
            return value;
        }
    }
});

Ext.namespace('Ext.ux.plugin');

// Plugin to format a phone number on value change
Ext.ux.plugin.FormatPhoneNumber = Ext.extend(Ext.form.TextField, {
    init: function(c) {
        c.on('change', this.onChange, this);
    },
    onChange: function(c) {
        c.setValue(Ext.util.Format.phoneNumber(c.getValue()));
    }
});

var validMobile = '^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$';
Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    vMobile: function (val, field) {
        return validMobile.test(val);
    },
    vMobileText: 'Не верный номер. Введите номер в формате +7XXXXXXXXXX.'
});

Ext.define('Stalfond.view.MainView', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainview',

    requires: [        
        'Ux.InputTextMask',
        'Stalfond.view.MainViewViewModel',
        'Ext.menu.Menu',
        'Ext.menu.Item',
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.CheckboxGroup',
        'Ext.form.field.Checkbox',
        'Ext.form.field.File',
        'Ext.grid.Panel',
        'Ext.grid.column.Number',
        'Ext.grid.column.Date',
        'Ext.grid.column.Boolean',
        'Ext.grid.View',
        'Ext.toolbar.Paging',
        'Stalfond.view.Qa',         
    ],

    viewModel: {
        type: 'mainview'
    },
    itemId: 'mainView',
    layout: 'border',
    defaultListenerScope: true,

    items: [
        {
            xtype: 'panel',
            region: 'west',
            split: true,
            itemId: 'menuPanel',
            width: 250,
            title: 'НПФ Стальфонд',
            items: [
                {
                    xtype: 'menu',
                    floating: false,
                    itemId: 'menu',
                    items: [
                        {
                            xtype: 'menuitem',
                            itemId: 'contract',
                            text: 'Договор ОПС'
                        },
                        {
                            xtype: 'menuitem',
                            itemId: 'lists',
                            text: 'Списки договоров'
                        },
                        {
                            xtype: 'menuitem',
                            itemId: 'reports',
                            text: 'Отчёты'
                        }
                    ],
                    listeners: {
                        click: 'onMenuClick'
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            region: 'center',
            itemId: 'contentPanel',
            layout: 'card',
            items: [
                {
                    xtype: 'panel',
                    itemId: 'contractPanel',
                    title: 'Договор ОПС',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'tabpanel',
                            flex: 1,
                            itemId: 'contractTabControl',
                            width: '100%',
                            activeTab: 0,
                            items: [
                                {
                                    xtype: 'panel',
                                    itemId: 'checkoutTabPage',
                                    title: 'Оформление',
                                    id: 'mainPanel',
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            itemId: 'contractToolbar',
                                            margin: 3,
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    text: 'Новый',
                                                    id: 'btnNew',
													listeners: {
														click: 'onNewDocument'
                                                    }   
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    text: 'Перевести в статус "Черновик"',
                                                    disabled: true,
                                                    id: 'btnStatus',
                                                    listeners: {
                                                        click: 'onStatusChange'
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    text: 'Печать',
                                                    id: 'btnPrint',
                                                    disabled: true,
                                                    menu: {
                                                        xtype: 'menu',
                                                        itemId: 'printMenu',
                                                        items: [
                                                            {
                                                                xtype: 'menuitem',
                                                                text: 'Напечатать договор'
                                                            }
                                                        ]
                                                    }
                                                },
                                            {
                                                xtype: 'button',
                                                scale: 'medium',
                                                text: 'Сохранить',
                                                id: 'btnSave',
                                                listeners: {
                                                    click: 'onSaveDocument'
                                                },
                                                disabled: true
                                                },
                                                {
                                                    xtype: 'button',
                                                    id: 'btn-annuler',
                                                    itemId: 'annuler',
                                                    scale: 'medium',
                                                    text: 'Аннулировать',
                                                    id: 'btnNull',
                                                    disabled: true
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            dock: 'top',
                                            height: '100%',
                                            itemId: 'conrtactCheckoutContainer',
                                            id: 'mainContainer',
                                            disabled: true,
                                            padding: 10,
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    margin: 10,
                                                    items: [
                                                        {
                                                            xtype: 'displayfield',
                                                            minWidth: 400,
                                                            width: '100%',
                                                            fieldLabel: 'Статус документа',
                                                            labelWidth: 150,
                                                            id: 'txtStatus'
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            minWidth: 400,
                                                            width: '100%',
                                                            fieldLabel: '№ документа',
                                                            labelWidth: 150,
                                                            id: 'txtDocNumber'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'container',
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            height: 200,
                                                            id: 'col-left',
                                                            margin: '',
                                                            width: '50%',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'stretch',
                                                                pack: 'end'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'fieldcontainer',
                                                                    flex: 1,
                                                                    height: 140,
                                                                    margin: 10,
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: '№ договора',
                                                                            labelWidth: 150,
                                                                            id: 'txtDogovorNumber',
                                                                            maskRe: /[0-9]/,
                                                                            mask: '999-999-999 99',
                                                                            submitEmptyText: false,
                                                                            emptyText: 'СНИЛС',
                                                                            allowBlank: false,
                                                                            blankText: "Введите № договора",
                                                                            regex: /^[\d]{3}-[\d]{3}-[\d]{3} [\d]{2}$/,
                                                                            regexText: 'Неверный формат СНИЛС. Введите номер в формате XXX-XXX-XXX XX.',
                                                                            plugins: [new Ux.InputTextMask('999-999-999 99')]
                                                                        },
                                                                        {
                                                                            xtype: 'combobox',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Агент',
                                                                            labelWidth: 150,
                                                                            id: 'ctrlAgent',
                                                                            displayField: 'name',
                                                                            valueField: 'id',
                                                                            editable: false,
                                                                            mode: 'local'                                                                            
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
																			id:'txtSurname',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Фимилия',
                                                                            labelWidth: 150,
                                                                            allowBlank: false,
                                                                            blankText: "Введите фамилию",
                                                                            submitEmptyText: false,
                                                                            listeners: {
                                                                                change: function (txt, newValue, oldValue)
                                                                                {
                                                                                    var val1 = Ext.getCmp('txtSurnameBirth').getValue();
                                                                                    if (val1 == oldValue)
                                                                                    {
                                                                                        Ext.getCmp('txtSurnameBirth').setValue(newValue);
                                                                                    }
                                                                                }
                                                                            },
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Имя',
                                                                            labelWidth: 150,
                                                                            id: 'txtName',
                                                                            allowBlank: false,
                                                                            blankText: "Введите имя",
                                                                            submitEmptyText: false,
                                                                            listeners: {
                                                                                change: function (txt, newValue, oldValue) {
                                                                                    var val1 = Ext.getCmp('txtNameBirth').getValue();
                                                                                    if (val1 == oldValue) {
                                                                                        Ext.getCmp('txtNameBirth').setValue(newValue);
                                                                                    }
                                                                                }
                                                                            },
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Отчество',
                                                                            labelWidth: 150,
                                                                            id: 'txtMiddleName',
                                                                            blankText: "Введите отчество",
                                                                            submitEmptyText: false,
                                                                            listeners: {
                                                                                change: function (txt, newValue, oldValue) {
                                                                                    var val1 = Ext.getCmp('txtMiddleNameBirth').getValue();
                                                                                    if (val1 == oldValue) {
                                                                                        Ext.getCmp('txtMiddleNameBirth').setValue(newValue);
                                                                                    }
                                                                                }
                                                                            },
                                                                        },
                                                                        {
                                                                            xtype: 'radiogroup',
                                                                            flex: 1,
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Пол',
                                                                            items: [
                                                                                {
                                                                                    xtype: 'radiofield',
                                                                                    boxLabel: 'Мужской',
                                                                                    margin:10,
                                                                                    checked:true
                                                                                },
                                                                                {
                                                                                    xtype: 'radiofield',
                                                                                    margin:10,
                                                                                    boxLabel: 'Женский'                                                                                    
                                                                                }
                                                                            ]
                                                                        }
                                                                        /*{
                                                                            xtype: 'combobox',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Пол',
                                                                            labelWidth: 150,
                                                                            id: 'ctrlGender',
                                                                            displayField: 'name',
                                                                            
                                                                            store: genderStorvalueField: 'id',
                                                                            editable: false,
                                                                            mode: 'local',e
                                                                        }*/
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            height: 200,
                                                            id: 'col-right',
                                                            width: '50%',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'stretch',
                                                                pack: 'end'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'fieldcontainer',
                                                                    flex: 1,
                                                                    height: 120,
                                                                    margin: 10,
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'datefield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Дата договора',
                                                                            labelWidth: 150,                                                                           
                                                                            id: 'dtDocumentDate',
                                                                            allowBlank: false,
                                                                            blankText: "Введите дату договора",                                                                           
                                                                            allowBlank: false,
                                                                            format: 'm.d.Y',                                                                           
                                                                            invalidText: "Дата",
                                                                            submitFormat: 'm.d.Y',                                                                            
                                                                            invalidText: "Дата",
                                                                            plugins: [new Ux.InputTextMask('99.99.9999')]
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Место заключения договора',
                                                                            labelWidth: 150,                                                                            
                                                                            id: 'txtContactArea',
                                                                            allowBlank: false,
                                                                            blankText: "Укажите регион",
                                                                            emptyText: "Укажите регион"
                                                                        },      
                                                                        /*{
                                                                            xtype: 'container',
                                                                            minWidth: 400,
                                                                            height: 210,
                                                                            labelWidth: 150,
                                                                            id: 'col-center-second',
                                                                            margin: '0 20 0 0',
                                                                            items: [
                                                                                {
                                                                                    xtype: 'kladr'
                                                                                }
                                                                            ]
                                                                        },*/    
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Фамилия при рожд.',
                                                                            labelWidth: 150,
                                                                            id: 'txtSurnameBirth',
                                                                            allowBlank: false,
                                                                            blankText: "Введите фамилию при рождении"
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Имя при рожд.',
                                                                            labelWidth: 150,
                                                                            id: 'txtNameBirth',
                                                                            allowBlank: false,
                                                                            blankText: "Введите имя при рождении"
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Отчество при рожд.',
                                                                            labelWidth: 150,
                                                                            id: 'txtMiddleNameBirth'
                                                                        },
                                                                        {
                                                                            xtype: 'datefield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Дата рождения',
                                                                            labelWidth: 150,
                                                                            format: 'm.d.Y',
                                                                            id: 'dtBirthDate',
                                                                            allowBlank: false,
                                                                            blankText: "Введите дату рождения",
                                                                            submitFormat: 'm.d.Y',                                                                            
                                                                            invalidText: "Дата",
                                                                            plugins: [new Ux.InputTextMask('99.99.9999')]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'container',
                                                    height: 26,
                                                    id: 'col-center',
                                                    margin: '0 20 0 0',
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            margin: '0 10 0 10',
                                                            minWidth: 400,
                                                            padding: '',
                                                            width: '100%',
                                                            fieldLabel: 'Место рождения',
                                                            labelWidth: 150,
                                                            id: 'txtBirthPlace',
                                                            allowBlank: false,
                                                            blankText: "Введите место рождения"
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'container',
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            height: 35,
                                                            id: 'col-left-first',
                                                            margin: '',
                                                            width: '50%',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'stretch',
                                                                pack: 'end',
                                                                padding: '-5 0'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'fieldcontainer',
                                                                    flex: 1,
                                                                    height: 30,
                                                                    margin: 10,
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Паспорт серия:',
                                                                            labelWidth: 150,
                                                                            id: 'txtPassport',
                                                                            allowBlank: false,
                                                                            blankText: "Введите серию паспорта",
                                                                            regex: /^[\d]{4}$/,
                                                                            regexText: 'Неверный формат серии паспорта. Введите номер в формате XXXX.'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            height: 35,
                                                            id: 'col-right-first',
                                                            width: '50%',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'stretch',
                                                                pack: 'end',
                                                                padding: '-5 0'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'fieldcontainer',
                                                                    flex: 1,
                                                                    height: 120,
                                                                    margin: 10,
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            padding: '',
                                                                            width: '100%',
                                                                            fieldLabel: 'Паспорт номер',
                                                                            labelWidth: 150,
                                                                            id: 'txtPassportNum',
                                                                            allowBlank: false,
                                                                            blankText: "Введите номер паспорта",
                                                                            regex: /^[\d]{6}$/,
                                                                            regexText: 'Неверный формат номера паспорта. Введите номер в формате XXXXХХ.'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'container',
                                                    height: 28,
                                                    id: 'col-center-first',
                                                    margin: '0 20 0 0',
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            margin: '0 10 0 10',
                                                            minWidth: 400,
                                                            padding: '',
                                                            width: '100%',
                                                            fieldLabel: 'Кем выдан',
                                                            labelWidth: 150,
                                                            id: 'txtPassportGivenBy',
                                                            allowBlank: false,
                                                            blankText: "Введите кем выдан паспорт"
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'container',
                                                    height: 30,
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            height: 30,
                                                            id: 'col-left-second',
                                                            margin: '',
                                                            width: '50%',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'stretch',
                                                                pack: 'end',
                                                                padding: '-10 0'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'fieldcontainer',
                                                                    flex: 1,
                                                                    height: 26,
                                                                    margin: 10,
                                                                    padding: '-10 0',
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'datefield',
                                                                            minWidth: 400,
                                                                            padding: '-8 0',
                                                                            width: '100%',
                                                                            fieldLabel: 'Дата выдачи',
                                                                            labelWidth: 150,
                                                                            format: 'm.d.Y',
                                                                            id: 'dtPassportGivenDate',
                                                                            allowBlank: false,
                                                                            blankText: "Введите дату выдачи паспорта",
                                                                            submitFormat: 'm.d.Y',                                                                            
                                                                            invalidText: "Дата",
                                                                            plugins: [new Ux.InputTextMask('99.99.9999')]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                /*
                                                {
                                                    xtype: 'container',
                                                    minWidth: 400,
                                                    height: 210,                                                    
                                                    labelWidth: 150,
                                                    id: 'col-center-second',
                                                    margin: '0 10 0 10',
                                                    items: [
                                                        {
                                                            xtype: 'kladr',                                                             
                                                            margin: '0 10 0 10',
                                                            minWidth: 400,
                                                            padding: '',
                                                            width: '100%',
                                                            fieldLabel: 'Адрес',
                                                            labelWidth: 150,
                                                            id: 'txtAddress',
                                                            allowBlank: false,
                                                            blankText: "Введите адрес"
                                                        }
                                                    ]
                                                },*/
                                                {
                                                    xtype: 'container',
                                                    height: 26,
                                                    id: 'col-center-second',
                                                    margin: '0 20 0 0',
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            margin: '0 10 0 10',
                                                            minWidth: 400,
                                                            padding: '',
                                                            width: '100%',
                                                            fieldLabel: 'Адрес',
                                                            labelWidth: 150,
                                                            id: 'txtAddress',
                                                            allowBlank: false,
                                                            blankText: "Введите адрес"
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'container',
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            height: 70,
                                                            id: 'col-left-last',
                                                            margin: '',
                                                            width: '50%',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'stretch',
                                                                pack: 'end',
                                                                padding: '-10 0'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'fieldcontainer',
                                                                    flex: 1,
                                                                    height: 120,
                                                                    margin: 10,
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'textfield', 
                                                                            id: 'phone_number', 
                                                                            name: 'phone_number', 
                                                                            emptyText: '', allowBlank: false, isAcceptV: false,
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Мобильный телефон',
                                                                            labelWidth: 150,
                                                                            //maskRe: /[0-9]/,
                                                                            allowBlank: false,                                                                                                                                                        
                                                                            blankText: "Введите мобильный телефон",
                                                                            //regex: /^(\+7)[\d ]{10}$/,
                                                                            //regexText: 'Неверный номер. Введите номер в формате +7 (XXX) XXXXXXX.',
                                                                            plugins: [new Ux.InputTextMask('+7 (99) 9999-9999')]
                                                                            //vtype: 'phone',
                                                                            /*listeners: {
                                                                                beforeRender:function(){
                                                                                        var phoneNumber =  this.getValue();
                                                                                         this.setValue( '+7 (' + phoneNumber.substr(0, 3) + ') ' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6, 4))
                                                                                    },
                                                                            }/                                                                                                    
                                                                            /*xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Мобильный телефон',
                                                                            labelWidth: 150,
                                                                            id: 'txtMobileNumber',
                                                                            allowBlank: false,
                                                                            //vtype: 'vMobile',
                                                                            blankText: "Введите мобильный телефон",
                                                                            regex: /^(\+7)[\d ]{10}$/,
                                                                            regexText: 'Неверный номер. Введите номер в формате +7XXXXXXXXXX.'*/
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Время д/св.',
                                                                            labelWidth: 150,
                                                                            id: 'txtContactTime',
                                                                            submitEmptyText: false,
                                                                            emptyText: 'с_до_'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            height: 70,
                                                            id: 'col-right-last',
                                                            width: '50%',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'stretch',
                                                                pack: 'end',
                                                                padding: '-10 0'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'fieldcontainer',
                                                                    flex: 1,
                                                                    height: 120,
                                                                    margin: 10,
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Доп. телефон',
                                                                            labelWidth: 150,
                                                                            id: 'txtAdditionalTel',                                                                            
                                                                            //regex: /^(\+7)[\d ]{10}$/,
                                                                            regexText: 'Неверный номер. Введите номер в формате +7 (XXX) XXXX-XXXX.',
                                                                            plugins: [new Ux.InputTextMask('+7 (99) 9999-9999')]
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'E-Mail',
                                                                            labelWidth: 150,
                                                                            id: 'txtEmail'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'container',
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            height: 70,
                                                            id: 'col-left-last1',
                                                            margin: '',
                                                            width: '50%',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'stretch',
                                                                pack: 'end',
                                                                padding: '-10 0'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'fieldcontainer',
                                                                    flex: 1,
                                                                    height: 120,
                                                                    margin: 10,
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'checkboxgroup',
                                                                            width: '50%',
                                                                            fieldLabel: 'Тип связи',
                                                                            items: [
                                                                                {
                                                                                    xtype: 'checkboxfield',
                                                                                    width: 100,
                                                                                    boxLabel: 'E-Mail',
                                                                                    id: 'chkEmail'
                                                                                },
                                                                                {
                                                                                    xtype: 'checkboxfield',
                                                                                    width: 180,
                                                                                    boxLabel: 'Почтовое отправление',
                                                                                    id: 'chkPostSend'
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    id: 'attachmentsTabPage',
                                    title: 'Прикреплённые файлы',
                                    items: [
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    id: 'attachmentContainer',
                                                    items: [
                                                        {
                                                            xtype: 'filefield',
                                                            fieldLabel: 'Загрузить документ',
                                                            labelWidth: 200
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'gridpanel',
                                                    height: 450,
                                                    title: 'Загруженные документы',
                                                    columns: [
                                                        {
                                                            xtype: 'gridcolumn',
                                                            dataIndex: 'string',
                                                            text: 'String'
                                                        },
                                                        {
                                                            xtype: 'numbercolumn',
                                                            dataIndex: 'number',
                                                            text: 'Number'
                                                        },
                                                        {
                                                            xtype: 'datecolumn',
                                                            dataIndex: 'date',
                                                            text: 'Date'
                                                        },
                                                        {
                                                            xtype: 'booleancolumn',
                                                            dataIndex: 'bool',
                                                            text: 'Boolean'
                                                        }
                                                    ],
                                                    dockedItems: [
                                                        {
                                                            xtype: 'pagingtoolbar',
                                                            dock: 'bottom',
                                                            width: 360,
                                                            displayInfo: true
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    itemId: 'listsPanel',
                    title: 'Списки договоров',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            id: 'nameContiner',
                            width: '100%',
                            items: [
                                {
                                    xtype: 'container',
                                    id: 'filtersContainer',
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 120,
                                            id: 'col-left-filter',
                                            minWidth: 300,
                                            width: '25%',
                                            items: [
                                                {
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Дата создания от',
                                                    labelWidth: 120,
                                                    format: 'm.d.Y',
                                                    invalidText: "Дата",
                                                    submitFormat: 'm.d.Y',                                                                            
                                                    invalidText: "Дата",
                                                    plugins: [new Ux.InputTextMask('99.99.9999')]
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Дата создания до',
                                                    labelWidth: 120,
                                                    format: 'm.d.Y',
                                                    invalidText: "Дата",
                                                    submitFormat: 'm.d.Y',                                                                            
                                                    invalidText: "Дата",
                                                    plugins: [new Ux.InputTextMask('99.99.9999')]
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Продукт',
                                                    labelWidth: 120
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Телефон',
                                                    labelWidth: 120,
                                                    regexText: 'Неверный номер. Введите номер в формате +7 (XXX) XXXX-XXXX.',
                                                    plugins: [new Ux.InputTextMask('+7 (99) 9999-9999')]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 120,
                                            id: 'col-left-filter-first',
                                            minWidth: 250,
                                            width: '20%',
                                            items: [                                                
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Снилс',
                                                    labelWidth: 100,
                                                    allowBlank: false,
                                                    blankText: "Введите № договора",
                                                    regex: /^[\d]{3}-[\d]{3}-[\d]{3} [\d]{2}$/,
                                                    regexText: 'Неверный формат СНИЛС. Введите номер в формате XXX-XXX-XXX XX.',
                                                    plugins: [new Ux.InputTextMask('999-999-999 99')]
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 250,
                                                    labelWidth: 100,
                                                    fieldLabel: 'ID заявки',                                                    
                                                    plugins: [new Ux.InputTextMask('999999999')]
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Дата начала от',
                                                    format: 'm.d.Y',
                                                    invalidText: "Дата",
                                                    submitFormat: 'm.d.Y',                                                                            
                                                    invalidText: "Дата",
                                                    plugins: [new Ux.InputTextMask('99.99.9999')]
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Статус'                                                    
                                                },
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 120,
                                            id: 'col-left-filter-second',
                                            minWidth: 200,
                                            width: '20%',
                                            items: [       
                                                {
                                                    xtype: 'combobox',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Статус',
                                                    colspan: 3, 
                                                    mode: 'local', 
                                                    forceSelection: true,
                                                    displayField: 'Name', 
                                                    valueField: 'ID',
                                                    store: new Ext.data.DirectStore({
                                                        autoLoad: true,
                                                        baseParams : {ProductID: idOfProduct},
                                                        root: 'data',
                                                        idProperty: 'ID',
                                                        api: {
                                                            read: VLib.API.StalfondDirect.GetDocumentStatus
                                                         },
                                                         fields: [
                                                            'ID', 'Name'
                                                         ]
                                                    })
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Подразделение'
                                                },                                    
                                                {
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'До',
                                                    format: 'm.d.Y',
                                                    invalidText: "Дата",
                                                    submitFormat: 'm.d.Y',                                                                            
                                                    invalidText: "Дата",
                                                    plugins: [new Ux.InputTextMask('99.99.9999')]
                                                }                                                
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 120,
                                            id: 'col-left-filter-last',
                                            minWidth: 200,
                                            width: '20%',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    margin: 10,
                                                    width: 200,
                                                    scale: 'medium',
                                                    text: 'Искать'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    id: 'resultContainer',
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            height: 450,
                                            title: 'Таблица договоров',
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    dataIndex: 'string',
                                                    text: 'Название'
                                                },
                                                {
                                                    xtype: 'numbercolumn',
                                                    dataIndex: 'number',
                                                    text: 'Номер'
                                                },
                                                {
                                                    xtype: 'datecolumn',
                                                    dataIndex: 'date',
                                                    text: 'Дата'
                                                },
                                                {
                                                    xtype: 'booleancolumn',
                                                    dataIndex: 'bool',
                                                    text: 'Boolean'
                                                }
                                            ],
                                            dockedItems: [
                                                {
                                                    xtype: 'pagingtoolbar',
                                                    dock: 'bottom',
                                                    width: 360,
                                                    displayInfo: true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    itemId: 'reportsPanel',
                    title: 'Отчёты',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            id: 'reportContainer',
                            width: '100%',
                            items: [
                                {
                                    xtype: 'container',
                                    id: 'reportListContainer',
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 80,
                                            id: 'col-left-report',
                                            minWidth: 300,
                                            width: '25%',
                                            items: [
                                                {
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Дата создания от',
                                                    labelWidth: 120,
                                                    format: 'm.d.Y'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Снилс',
                                                    labelWidth: 120
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 80,
                                            id: 'col-left-report-first',
                                            minWidth: 180,
                                            width: '20%',
                                            items: [
                                                {
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 180,
                                                    fieldLabel: 'До',
                                                    labelWidth: 50,
                                                    format: 'm.d.Y'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 180,
                                                    fieldLabel: 'ШК',
                                                    labelWidth: 50
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 80,
                                            id: 'col-left-report-second',
                                            minWidth: 180,
                                            width: '20%',
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 180,
                                                    fieldLabel: 'Продукт',
                                                    labelWidth: 50
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 80,
                                            id: 'col-left-report-last',
                                            minWidth: 180,
                                            width: '20%',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    margin: 5,
                                                    width: 200,
                                                    scale: 'medium',
                                                    text: 'Поиск'
                                                },
                                                {
                                                    xtype: 'button',
                                                    margin: 5,
                                                    width: 200,
                                                    scale: 'medium',
                                                    text: 'Выбрать всё'
                                                },
                                                {
                                                    xtype: 'button',
                                                    margin: 5,
                                                    width: 200,
                                                    scale: 'medium',
                                                    text: 'Печать'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    id: 'reportListGridContainer',
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            height: 450,
                                            title: 'Таблица договоров',
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    dataIndex: 'string',
                                                    text: 'String'
                                                },
                                                {
                                                    xtype: 'numbercolumn',
                                                    dataIndex: 'number',
                                                    text: 'Number'
                                                },
                                                {
                                                    xtype: 'datecolumn',
                                                    dataIndex: 'date',
                                                    text: 'Date'
                                                },
                                                {
                                                    xtype: 'booleancolumn',
                                                    dataIndex: 'bool',
                                                    text: 'Boolean'
                                                }
                                            ],
                                            dockedItems: [
                                                {
                                                    xtype: 'pagingtoolbar',
                                                    dock: 'bottom',
                                                    width: 360,
                                                    displayInfo: true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    onMenuClick: function(menu, item, e, eOpts) {
        location.hash = item.itemId;
    },
	
	onSaveDocument: function(){
		console.log('onSaveDocument fired');
		var doc = buildDocument(true);
		
		if (doc.isOk == true) {
		    VLib.API.StalfondDirect.SaveDocument(doc, function(resp) {
		        Ext.getCmp('txtDocNumber').setValue(resp.docNumber);
		        Ext.getCmp('txtStatus').setValue(resp.statusText);
		        Ext.getCmp('btnStatus').setText('Перевести в статус "На обзвоне"');
		    });
		}		
	},

	onStatusChange: function () {
	    console.log('onStatusChange fired');
	    var doc = buildDocument(false);
	    if (doc.isOk == true) {
	        VLib.API.StalfondDirect.ChangeStatus(doc, function (resp) {
	            Ext.getCmp('txtStatus').setValue(resp.statusText);
	            if (resp.status == "Черновик") {
	                Ext.getCmp('btnStatus').setText('Перевести в статус "Напечатанные"');
	            } else if (resp.status == "Заведенный") {
	                Ext.getCmp('btnStatus').setText('Перевести в статус "Напечатанные"');
	            } else if (resp.status == "Напечатанный") {
	                Ext.getCmp('btnStatus').setText('Перевести в статус "На обзвоне"');
	            } else if (resp.status == "На обзвоне") {
	                Ext.getCmp('btnStatus').setText('Перевести в статус "На обзвоне"');
	                Ext.getCmp('btnStatus').setDisabled(true);
	            }
	        });
	    }
	},
	
	onNewDocument: function(){
		console.log('onNewDocument fired');
		VLib.API.StalfondDirect.NewDocument(null, function (resp) {
		    console.log(resp);
		    setDisable(false);
		    clearForm();
		    Ext.getCmp('txtDocNumber').setValue(resp.docNumber);
		    Ext.getCmp('txtStatus').setValue(resp.statusText);
		    Ext.getCmp('btnStatus').setText('Перевести в статус "Черновики"');
		});
	},
    
});

function getControlValue(ctrlId, doc) {
    var ctrl = Ext.getCmp(ctrlId);
    if (!doc.validate || ctrl.isValid()) {
        return ctrl.getValue();
    } else {
        doc.isOk = false;
        return null;
    }
}

function buildDocument(validate) {
    var doc = {};
    
    try {
        doc.isOk = true;
        doc.validate = validate;
        doc.docNumber = getControlValue('txtDocNumber', doc);
        doc.dogovorNumber = getControlValue('txtDogovorNumber', doc);
        doc.surname = getControlValue('txtSurname', doc);
        doc.status = getControlValue('txtStatus', doc);
        doc.name = getControlValue('txtName', doc);
        doc.middleName = Ext.getCmp('txtMiddleName').getValue();
        //doc.Gender = getControlValue('ctrlGender', doc);
        doc.DocumentDate = getControlValue('dtDocumentDate', doc);
        doc.SurnameBirth = getControlValue('txtSurnameBirth', doc);
        doc.NameBirth = getControlValue('txtNameBirth', doc);
        doc.MiddleNameBirth = Ext.getCmp('txtMiddleNameBirth').getValue();
        doc.BirthDate = getControlValue('dtBirthDate', doc);
        doc.BirthPlace = getControlValue('txtBirthPlace', doc);
        doc.Passport = getControlValue('txtPassport', doc);
        doc.PassportNum = getControlValue('txtPassportNum', doc);
        doc.PassportGivenBy = getControlValue('txtPassportGivenBy', doc);
        doc.PassportGivenDate = getControlValue('dtPassportGivenDate', doc);
        doc.Address = getControlValue('txtAddress', doc);
        //doc.MobileNumber = getControlValue('txtMobileNumber', doc);
        doc.ContactTime = Ext.getCmp('txtContactTime').getValue();
        doc.AdditionalTel = Ext.getCmp('txtAdditionalTel').getValue();
        doc.Email = Ext.getCmp('txtEmail').getValue();
        doc.isEmail = Ext.getCmp('chkEmail').getValue();
        doc.isPostSend = Ext.getCmp('chkPostSend').getValue();

        return doc;
    } catch(err) {
        return null;
    }
};

function setDisable(disable) {
    Ext.getCmp('mainContainer').setDisabled(disable);
    //Ext.getCmp('btnNull').setDisabled(disable);
    Ext.getCmp('btnStatus').setDisabled(disable);
    //Ext.getCmp('btnPrint').setDisabled(disable);
    Ext.getCmp('btnSave').setDisabled(disable);
};

function clearForm()
{
    Ext.getCmp('txtDocNumber').setValue('');
    Ext.getCmp('txtStatus').setValue('');
    Ext.getCmp('txtDocNumber').setValue('');
    Ext.getCmp('txtSurname').setValue('');
    Ext.getCmp('txtName').setValue('');
    Ext.getCmp('txtMiddleName').setValue('');
    //Ext.getCmp('ctrlGender').select('М');
    Ext.getCmp('dtDocumentDate').setValue('');
    Ext.getCmp('txtSurnameBirth').setValue('');
    Ext.getCmp('txtNameBirth').setValue('');
    Ext.getCmp('txtMiddleNameBirth').setValue('');
    Ext.getCmp('dtBirthDate').setValue('');
    Ext.getCmp('txtBirthPlace').setValue('');
    Ext.getCmp('txtPassport').setValue('');
    Ext.getCmp('txtPassportNum').setValue('');
    Ext.getCmp('txtPassportGivenBy').setValue('');
    Ext.getCmp('dtPassportGivenDate').setValue('');
    //Ext.getCmp('txtAddress').setValue('');
    //Ext.getCmp('txtMobileNumber').setValue('');
    Ext.getCmp('txtContactTime').setValue('');
    Ext.getCmp('txtAdditionalTel').setValue('');
    Ext.getCmp('txtEmail').setValue('');
    Ext.getCmp('chkEmail').setValue('');
    Ext.getCmp('chkPostSend').setValue('');
    Ext.getCmp('txtDogovorNumber').setValue('');
}
