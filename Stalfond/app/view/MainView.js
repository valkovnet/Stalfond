/*
 * File: app/view/MainView.js
 */

Ext.define('Stalfond.view.MainView', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainview',

    requires: [
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
        'Ext.toolbar.Paging'
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
													listeners: {
														click: 'onNewDocument'
                                                    }   
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    text: 'Перевести в статус "На обзвоне"'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    text: 'Печать',
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
                                                listeners: {
                                                    click: 'onSaveDocument'
                                                    }   
                                                },
                                                {
                                                    xtype: 'button',
                                                    id: 'btn-annuler',
                                                    itemId: 'annuler',
                                                    scale: 'medium',
                                                    text: 'Аннулировать'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            dock: 'top',
                                            height: '100%',
                                            itemId: 'conrtactCheckoutContainer',
                                            id: 'mainContainer',
                                            padding: 10,
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    margin: 10,
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            minWidth: 400,
                                                            width: '100%',
                                                            fieldLabel: 'Статус документа',
                                                            labelWidth: 150,
                                                            id: 'txtStatus'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'container',
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            height: 160,
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
                                                                    height: 120,
                                                                    margin: 10,
                                                                    width: '50%',
                                                                    items: [
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: '№ договора',
                                                                            labelWidth: 150,
                                                                            id: 'txtDocNumber'
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
																			id:'txtSurname',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Фимилия',
                                                                            labelWidth: 150,
                                                                            allowBlank: false,
                                                                            blankText: "Введите фамилию"
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Имя',
                                                                            labelWidth: 150,
                                                                            id: 'txtName',
                                                                            allowBlank: false,
                                                                            blankText: "Введите имя"
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Отчество',
                                                                            labelWidth: 150
                                                                        },
                                                                        {
                                                                            xtype: 'combobox',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Пол',
                                                                            labelWidth: 150
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            height: 160,
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
                                                                            labelWidth: 150
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Фамилия при рожд.',
                                                                            labelWidth: 150
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Имя при рожд.',
                                                                            labelWidth: 150
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Отчество при рожд.',
                                                                            labelWidth: 150
                                                                        },
                                                                        {
                                                                            xtype: 'datefield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Дата рождения',
                                                                            labelWidth: 150
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
                                                            labelWidth: 150
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
                                                                            labelWidth: 150
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
                                                                            labelWidth: 150
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
                                                            labelWidth: 150
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
                                                                            labelWidth: 150
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
                                                            labelWidth: 150
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
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Мобильный телефон',
                                                                            labelWidth: 150
                                                                        },
                                                                        {
                                                                            xtype: 'combobox',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'Время д/св.',
                                                                            labelWidth: 150
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
                                                                            labelWidth: 150
                                                                        },
                                                                        {
                                                                            xtype: 'textfield',
                                                                            minWidth: 400,
                                                                            width: '100%',
                                                                            fieldLabel: 'E-Mail',
                                                                            labelWidth: 150
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
                                                                                    boxLabel: 'E-Mail'
                                                                                },
                                                                                {
                                                                                    xtype: 'checkboxfield',
                                                                                    width: 180,
                                                                                    boxLabel: 'Почтовое отправление'
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
                                                    labelWidth: 120
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Дата создания до',
                                                    labelWidth: 120
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
                                                    labelWidth: 120
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
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 200,
                                                    fieldLabel: 'От',
                                                    labelWidth: 80
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 200,
                                                    fieldLabel: 'До',
                                                    labelWidth: 80
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 200,
                                                    fieldLabel: 'Снилс',
                                                    labelWidth: 80
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 200,
                                                    fieldLabel: 'ID заявки',
                                                    labelWidth: 80
                                                }
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
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Дата начала от'
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Статус'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Подразделение'
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
                                                    xtype: 'datefield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'От'
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'Подразделение'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    margin: 10,
                                                    width: 250,
                                                    fieldLabel: 'ID'
                                                },
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
                                                    labelWidth: 120
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
                                                    labelWidth: 50
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
		var doc = buildDocument();
		
		if (doc.isOk == true) {
		    VLib.API.StalfondDirect.SaveDocument(doc, function(resp) {
		        Ext.getCmp('txtDocNumber').setValue(resp.docNumber);
		        Ext.getCmp('txtStatus').setValue(resp.statusText);
		    });
		}		
	},
	
	onNewDocument: function(){
		console.log('onNewDocument fired');
		VLib.API.StalfondDirect.NewDocument(null, function (resp) {
		    console.log(resp);
		    Ext.getCmp('txtDocNumber').setValue(resp.docNumber);
		    Ext.getCmp('txtStatus').setValue(resp.statusText);
		});
	},
    
});

function getControlValue(ctrlId, doc) {
    var ctrl = Ext.getCmp(ctrlId);
    if (ctrl.isValid()) {
        return ctrl.getValue();
    } else {
        doc.isOk = false;
        return null;
    }
}

function buildDocument() {
    var doc = {};
    
    try {
        doc.isOk = true;
        doc.docNumber = getControlValue('txtDocNumber', doc);
        doc.Surname = getControlValue('txtSurname', doc);
        doc.Name = getControlValue('txtName', doc);

        return doc;
    } catch(err) {
        return null;
    }
};