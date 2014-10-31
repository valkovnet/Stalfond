/*
 * File: app/view/MainView.js
 *
 * This file was generated by Sencha Architect version 3.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 5.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 5.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('FtApp.view.MainView', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainview',

    requires: [
        'FtApp.view.MainViewViewModel',
        'Ext.menu.Menu',
        'Ext.menu.Item',
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.toolbar.Toolbar',
        'Ext.form.field.File',
        'Ext.form.Label'
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
            width: 230,
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
                    title: 'Договор',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'tabpanel',
                            flex: 1,
                            alignTarget: 'center',
                            componentLayout: 'dock',
                            height: '100%',
                            width: '100%',
                            bodyBorder: false,
                            manageHeight: false,
                            activeTab: 0,
                            plain: true,
                            layout: {
                                type: 'card',
                                deferredRender: false
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    height: '100%',
                                    manageHeight: false,
                                    title: 'Оформление',
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            margin: 3,
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    text: 'Новый'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    text: 'Перевести в статус  "На обзвоне"'
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'btnPrint',
                                                    scale: 'medium',
                                                    text: 'Печать',
                                                    menu: {
                                                        xtype: 'menu',
                                                        itemId: 'btnPrintMenu',
                                                        items: [
                                                            {
                                                                xtype: 'menuitem',
                                                                itemId: 'mmPrint',
                                                                text: 'Печать'
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'btnSave',
                                                    scale: 'medium',
                                                    text: 'Сохранить'
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'btnCancel',
                                                    scale: 'medium',
                                                    text: 'Анулировать'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    height: '100%',
                                    manageHeight: false,
                                    title: 'Прикреплённые файлы',
                                    dockedItems: [
                                        {
                                            xtype: 'filefield',
                                            dock: 'top',
                                            margin: 10,
                                            fieldLabel: 'Загрузить документ:',
                                            labelWidth: 200,
                                            buttonMargin: 10,
                                            buttonText: 'Обзор...'
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
                            xtype: 'label',
                            text: 'About Us View'
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
                            xtype: 'label',
                            text: 'Contact Us View'
                        }
                    ]
                }
            ]
        }
    ],

    onMenuClick: function(menu, item, e, eOpts) {
        location.hash = item.itemId;
    }

});