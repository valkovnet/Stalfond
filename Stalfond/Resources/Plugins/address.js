// Панелька для UralSib CS

// Регистрация пространств имён
if (typeof (Virtu) == "undefined") {
    Type.registerNamespace("Virtu");
}

if (typeof (Virtu.Plugins) == "undefined") {
    Type.registerNamespace("Virtu.Plugins");
}

// Панелька Адреса с возможностью заблокировать скрытие (canHide) © haku, 2012

// Перепилил все нахрен для использования КЛАДР. Впридачу привинтил штуки для валидации, выставления значения, забирания значения.

//------------------------------------------------------------------------- Шаблон панели адреса -------------------------------------------------------------

/*
В Google Chrome при передаче фокуса путём закрытия панели ввода адреса, сам фокус не передаётся другому элементу (впечталение, что баг Google Chrome).
*/

/*
© Virtu Systems, 2010
Vinogradov S.V.
Компонент предназначен для использования в формах, в случае нужды ввода географического адреса 
Компонент состоит из двух частей (части редактирования и части отображения):
автоматически скрываемой панели типа Virtu.Plugins.AddressPanel (имя класса совпадает с xtype), которая используется для ввода и редактирования адреса,
и поля отображения введённого адреса типа Virtu.Plugins.Address, которое всегда отображается на форме (при переходе на это поле фокуса ввода автоматически раскрывается форма ввода адреса)

Использование компонента:
Компонент по умолчанию предназначен к использованию в таблице с 4-мя ячейками (layout: 'table')
В этом случае создание компонента выглядит так:
var mAddress = new Virtu.Plugins.Address
({
id: 'FullAdress',
onHideFocusObjectId: 'InsurerWorkTel'
});
где onHideFocusObjectId - идентификатор визуального элемента ExtJs, на который переходит фокус ввода после закрытия (сокрытия) формы ввода адреса
При создании используются значения ширин по умолчанию
        
В табличную форму, созданную с четырьмя столбцами
layout: 'table',
layoutConfig: {columns: 4},
переменная просто добавляется в items
items: [mAddress]
        
Более сложное добавление объекта
{ xtype:    'Virtu.Plugins.Address',                    // указываем xtype объекта
id:       'FullAdress_' + rowIndex + '_',               // задаём некий идентификатор компонента,
// rowIndex здесь играет роль некоторого номера, например, номера строки таблицы, в котором отображается данный компонент
// (в таком случае одновременно может отображаться и существовать не один компонент ввода адреса и, для правильной работы компонента, их идентификаторы должны различаться)
columnX: [0, 143, 570],                                 // поля видимой формы справа, начало отображения поля, ширина поля
// (не заданы элементы: отступ скрытой панели справа,
// ширина панели [по умолчанию оба элемента совпадают с элементами 1 и 2, если не знаданы или заданы undefined, будут принудительно приравнены к ним]),
// отступ элементов справа (поля справа) [в настоящий момент данное число не используется при отрисовке]
columnH: [23, 5, 5],                                    // высота поля, поля (отступы) сверху, отступ выравнивания по вертикали для текста надписи
// (иначе надпись будет выравнена по верхнему краю и будет сильно приподнята относительно текстового поля)
noAdress: true,                                         // скрываем надпись "Адрес страхователя", если нужно изменить надпись на другую, используем adressLabelText (отступ columnX[1] игнорируется)
fullWidth: true,                                        // игнорируем отступ для скрытой панели ввода, разворачивая её на всю ширину компонента
name: 'FullAdress',                                     // Имя объекта, если собираемся что-то с ним делать (возможно, нужно делать уникальным, как и id, однако сам компонент безразличен к тому, задан ли name и если задан, то какой именно)
emptyText: "введите адрес местонахождения имущества",   // надпись на видимом компоненте отображения адреса, если адрес ещё не задан
colspan: 1,                                             // по умолчанию компонент занимает 4 ячейки таблицы, мы переопределяем это
panelColumnH: [0, 30, 5],                               // дополнительное место внизу панели ввода, высота строк панели ввода, выравнивающее смещение для надписей
onHideFocusObjectId: 'a2'                               // как указано выше, id объекта, который получит фокус после сокрытия панели ввода
}
*/

/*
Это сама панель для ввода адреса. По-умолчанию она сокрыта и показывается, когда пользователь желает ввести или изменить адрес
*/



Virtu.Plugins.AddressPanel = Ext.extend(Ext.Panel,
{
    header: true,                           // отображаем заголовок, в нёмт будет кнопка сокрытия элемента
    columnsX: [5, 130, 12],                 // Поля слева (отступ от левой границы), начало второго столбца данных, поля слева для обоих столбцов
    hidden: true,                           // По-умолчанию панель сокрыта (открывается по запросу пользователя из другого компонента)
    autoHeight: false,                      // Сами работаем над высотой
    autoWidth: false,                       // Сами работаем над шириной
    padding: '0 0 0 0',
    canHide: true,
    headerCssClass: 'headerAdress',
    bodyStyle: "background-color: #ffffff; border-top-style: none;",
    // border-top-style: none устанавливается явно,
    // так как иначе из-за наследования стилей в таблицах может получится лишняя черта,
    // разделяющая заголовок с телом панели 
    layout: 'absolute',                     // Позиционируем элементы по их координатам
    defaults: { style: { margin: '0px 0px 0px 0px' } },
    // columnH: [3, 25, 5],                 // дополнительное место внизу панели ввода, высота строк панели ввода, выравнивающее смещение для надписей

    // Кнопка сокрытия панели, по нажатию панель скрывается
    // В компоненте Virtu.Plugins.Address по событию 'hide' выполняются необходимые операции
    tools: [{
        id: 'toggle' + this.id, hidden: this.canHide, qtip: 'Скрыть панель ввода адреса',
        handler: function (event, toolEl, panel) {
            panel.hide();
        }
    }],

    featureFramework: null,

    // Функция преобразования адреса из полей в одну строку
    createAdress: function () {
        var fullAdress = '';
        var colon = '';

        var index = Ext.getCmp('AdressIndex' + this.id).getValue();
        if (index != '') {
            fullAdress += colon + index;
            colon = ', ';
        }

        var subject = Ext.getCmp('AdressSubject' + this.id).getValue();
        if (subject != '' && this.subjectCode != '') {
            fullAdress += colon + Ext.getCmp('AdressSubject' + this.id).lastSelectionText;
            colon = ', ';
        }

        var regionArea = Ext.getCmp('AdressRegionArea' + this.id).getValue();
        if (regionArea != '' && this.regionAreaCode != '') {
            fullAdress += colon + Ext.getCmp('AdressRegionArea' + this.id).lastSelectionText;
            colon = ', ';
        }

        var city = Ext.getCmp('AdressCity' + this.id).getValue();
        if (city != '' && this.cityCode != '') {
            fullAdress += colon + Ext.getCmp('AdressCity' + this.id).lastSelectionText;
            colon = ', ';
        }

        var town = Ext.getCmp('AdressTown' + this.id).getValue();
        if (town != '' && town != 'Не выбрано' && (this.forbidCustomAddress == false || this.townCode != '')) {
            fullAdress += colon + Ext.getCmp('AdressTown' + this.id).lastSelectionText;
            colon = ', ';
        }

        var street = Ext.getCmp('AdressStreet' + this.id).getValue();
        if (street != '' && street != 'Не выбрано') {
            fullAdress += colon + Ext.getCmp('AdressStreet' + this.id).lastSelectionText;
            colon = ', ';
        }

        var house = Ext.getCmp('AdressHouse' + this.id).getValue();
        if (house != '') {
            fullAdress += colon + "д. " + house;
            colon = ', ';
        }

        var building = Ext.getCmp('AdressBuilding' + this.id).getValue();
        if (building != '') {
            fullAdress += colon + "стр. " + building;
            colon = ', ';
        }

        var room = Ext.getCmp('AdressRoom' + this.id).getValue();
        if (room != '') {
            fullAdress += colon + "кв. " + room;
            colon = ', ';
        }

        return fullAdress;
    },

    KLADRCode: '',
    subjectCode: '',
    regionAreaCode: '',
    cityCode: '',
    townCode: '',

    createKLADRCode: function () {
        var klardStr = this.subjectCode == '' ? '00' : this.subjectCode < 10 ? '0' + this.subjectCode.toString() : this.subjectCode.toString();
        klardStr += (this.regionAreaCode == '' ? '000' : this.regionAreaCode < 10 ? '00' + this.regionAreaCode.toString() : this.regionAreaCode < 100 ? '0' + this.regionAreaCode.toString() : this.regionAreaCode.toString());
        klardStr += (this.cityCode == '' ? '000' : this.cityCode < 10 ? '00' + this.cityCode.toString() : this.cityCode < 100 ? '0' + this.cityCode.toString() : this.cityCode.toString());
        klardStr += (this.townCode == '' ? '000' : this.townCode < 10 ? '00' + this.townCode.toString() : this.townCode < 100 ? '0' + this.townCode.toString() : this.townCode.toString());

        this.KLADRCode = klardStr + '00';
        return this.KLADRCode;
    },

    clear: function () {
        var items = this.items.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.xtype == 'textfield') {
                item.setValue('');
            }
        }
    },

    onRender: function () {
        Virtu.Plugins.AddressPanel.superclass.onRender.apply(this, arguments);      // Вызываем обработчик предка, чтобы ничего не испортить

        var currenctY = 0;                                          // Текущая координата по вертикальной оси, по которой мы выводим компонент
        var addX = 0;                                               // Приращение по горизонтальной оси (координата второго столбца или ноль)
        for (var i = 0; i < this.items.length; i++) {
            if (typeof (this.items.items[i]) == 'undefined')
                continue;


            if (i >= this.items.length / 2)                         // Записываем в приращение координату второго столбца
                addX = this.width / 2;
            if (i == this.items.length / 2)                         // Обнуляем текущую позицию по вертикальной оси, когда начинаем выводить второй стобец
                currenctY = 0;

            //var w = Ext.util.TextMetrics.createInstance(this.items.items[i].el).getWidth(this.items.items[i].getValue());

            if (typeof (this.items.items[i].xtype) != 'undefined')
                if (this.items.items[i].xtype == 'displayfield') {
                    this.items.items[i].x = this.columnsX[0] + addX;
                    this.items.items[i].y = currenctY + this.columnH[2];
                    this.items.items[i].style += { 'text-align': 'left' };
                    this.items.items[i].setWidth(this.columnsX[1] - this.columnsX[0]);
                }
                else {
                    this.items.items[i].x = this.columnsX[1] + addX;
                    this.items.items[i].y = currenctY;
                    this.items.items[i].setWidth(this.width / 2 - this.columnsX[1] - this.columnsX[2]);
                    currenctY += this.columnH[1];
                }
        }

        this.setHeight(currenctY + this.columnH[0]);
    },

    // Заложимся на то, что составители КЛАДРа - не идиоты, и повторяющихся имен в рамках одного субъекта и т.п. нет
    findSelectedValue: function (combo) {
        var value = combo.getValue();
        if (value == 'Не выбрано')
            return 0;
        if (!combo.extendedStore) return;
        var leftIndex = 0;
        var rightIndex = combo.extendedStore.length - 1;

        while (rightIndex - leftIndex > 1) {
            var index = Math.round((rightIndex + leftIndex) / 2);
            if (combo.extendedStore[index].Name == value)
                return combo.extendedStore[index].Code;
            if (combo.extendedStore[index].Name < value)
                leftIndex = index;
            else
                rightIndex = index;
        }

        return combo.extendedStore[leftIndex].Name == value ? combo.extendedStore[leftIndex].Code :
            combo.extendedStore[rightIndex].Name == value ? combo.extendedStore[rightIndex].Code : 0;
    },

    findSelectedIndex: function (combo) {
        var value = combo.getValue();
        if (value == 'Не выбрано')
            return -1;

        var leftIndex = 0;
        var rightIndex = combo.extendedStore.length - 1;

        while (rightIndex - leftIndex > 1) {
            var index = Math.round((rightIndex + leftIndex) / 2);
            if (combo.extendedStore[index].Name == value)
                return index;
            if (combo.extendedStore[index].Name < value)
                leftIndex = index;
            else
                rightIndex = index;
        }

        return combo.extendedStore[leftIndex].Name == value ? leftIndex :
            combo.extendedStore[rightIndex].Name == value ? rightIndex : -1;
    },

    initComponent: function () {


        Ext.applyIf(this, {

            // Создаём, точнее, определяем все нужные нам элементы.
            // Элементы выводятся по порядку задания: сначала первый столбец, затем второй столбец, сначала надпись, затем поле ввода
            items:
            [
            // Первый столбец
                { xtype: 'displayfield', id: 'lblSubject' + this.id, name: 'lblSubject' + this.id, value: "Субъект РФ:", fieldClass: 'x-form-field', vReadOnly: true },
                {
                    xtype: 'combo',
                    vReadOnly: true,
                    id: 'AdressSubject' + this.id,
                    name: 'AdressSubject' + this.id,
                    allowBlank: true,

                    mode: 'local',
                    triggerAction: 'all',
                    forceSelection: true,

                    store: ['Не выбрано'],
                    containerID: this.id,
                    storeLoaded: false,
                    extendedStore: null,

                    listeners:
                    {
                        blur: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.fireEvent('datachanged', container);
                        },
                        beforequery: function (obj) {
                            var combo = obj.combo;
                            var container = Ext.getCmp(combo.containerID);
                            if (!combo.storeLoaded) {
                                if (container.featureFramework != null) {
                                    combo.extendedStore = container.featureFramework.Execute('/KLADRFeature/GetStates', {});
                                }
                                combo.storeLoaded = true;
                            }
                            var store = obj.query == '' ? ['Не выбрано'] : [];
                            for (var i = 0; i < combo.extendedStore.length; i++) {
                                if (obj.query == '' || combo.extendedStore[i].Name.toUpperCase().indexOf(obj.query.toUpperCase()) == 0)
                                    store[store.length] = combo.extendedStore[i].Name;
                            }
                            combo.bindStore(store);
                        },
                        select: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.subjectCode = container.findSelectedValue(obj);

                            // очистка других контролов, включая сторы
                            var regionAreasCombo = Ext.getCmp('AdressRegionArea' + obj.containerID);
                            regionAreasCombo.clearValue();
                            regionAreasCombo.extendedStore = null;
                            regionAreasCombo.storeLoaded = false;

                            var citiesCombo = Ext.getCmp('AdressCity' + obj.containerID);
                            citiesCombo.clearValue();
                            citiesCombo.extendedStore = null;
                            citiesCombo.storeLoaded = false;

                            var townsCombo = Ext.getCmp('AdressTown' + obj.containerID);
                            townsCombo.clearValue();
                            townsCombo.extendedStore = null;
                            townsCombo.storeLoaded = false;

                            var streetsCombo = Ext.getCmp('AdressStreet' + obj.containerID);
                            streetsCombo.clearValue();
                            streetsCombo.extendedStore = null;
                            streetsCombo.storeLoaded = false;

                            Ext.getCmp('AdressIndex' + obj.containerID).setValue('');
                            Ext.getCmp('AdressGNINMB' + obj.containerID).setValue('');

                            this.ownerCt.fireEvent('datachanged', this.ownerCt);
                        }
                    }
                },

                { xtype: 'displayfield', value: "Район:", id: 'lblRegionArea' + this.id, name: 'lblRegionArea' + this.name, fieldClass: 'x-form-field' },
                {
                    xtype: 'combo',
                    vReadOnly: true,
                    id: 'AdressRegionArea' + this.id,
                    name: 'AdressRegionArea' + this.id,
                    allowBlank: true,

                    mode: 'local',
                    triggerAction: 'all',
                    forceSelection: true,

                    store: ['Не выбрано'],
                    containerID: this.id,
                    storeLoaded: false,
                    extendedStore: null,

                    listeners:
                    {
                        blur: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.fireEvent('datachanged', container);
                        },
                        beforequery: function (obj) {
                            var combo = obj.combo;
                            var container = Ext.getCmp(combo.containerID);
                            if (!combo.storeLoaded) {
                                if (container.featureFramework != null) {
                                    var stateCode = container.subjectCode;
                                    if (stateCode === '')
                                        stateCode = 0;
                                    combo.extendedStore = container.featureFramework.Execute('/KLADRFeature/GetRegionAreas', { 'StateCode': stateCode });
                                }
                                combo.storeLoaded = true;
                            }
                            var store = obj.query == '' ? ['Не выбрано'] : [];
                            for (var i = 0; i < combo.extendedStore.length; i++) {
                                if (obj.query == '' || combo.extendedStore[i].Name.toUpperCase().indexOf(obj.query.toUpperCase()) == 0)
                                    store[store.length] = combo.extendedStore[i].Name;
                            }
                            combo.bindStore(store);
                        },
                        select: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.regionAreaCode = container.findSelectedValue(obj);

                            // очистка других контролов, включая сторы
                            var citiesCombo = Ext.getCmp('AdressCity' + obj.containerID);
                            citiesCombo.clearValue();
                            citiesCombo.extendedStore = null;
                            citiesCombo.storeLoaded = false;

                            var townsCombo = Ext.getCmp('AdressTown' + obj.containerID);
                            townsCombo.clearValue();
                            townsCombo.extendedStore = null;
                            townsCombo.storeLoaded = false;

                            var streetsCombo = Ext.getCmp('AdressStreet' + obj.containerID);
                            streetsCombo.clearValue();
                            streetsCombo.extendedStore = null;
                            streetsCombo.storeLoaded = false;

                            Ext.getCmp('AdressIndex' + obj.containerID).setValue('');
                            Ext.getCmp('AdressGNINMB' + obj.containerID).setValue('');

                            this.ownerCt.fireEvent('datachanged', this.ownerCt);
                        }
                    }
                },

                { xtype: 'displayfield', value: "Город:", id: 'lblCity' + this.id, name: 'lblCity' + this.name, fieldClass: 'x-form-field' },
                {
                    xtype: 'combo',
                    vReadOnly: true,
                    id: 'AdressCity' + this.id,
                    name: 'AdressCity' + this.id,
                    allowBlank: true,

                    mode: 'local',
                    triggerAction: 'all',
                    forceSelection: this.forbidCustomAddress,

                    store: ['Не выбрано'],
                    containerID: this.id,
                    storeLoaded: false,
                    extendedStore: null,

                    listeners:
                    {
                        blur: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.fireEvent('datachanged', container);
                        },
                        beforequery: function (obj) {
                            var combo = obj.combo;
                            var container = Ext.getCmp(combo.containerID);
                            if (!combo.storeLoaded) {
                                if (container.featureFramework != null) {
                                    var stateCode = container.subjectCode;
                                    if (stateCode === '')
                                        stateCode = 0;

                                    var regionAreaCode = container.regionAreaCode;
                                    if (regionAreaCode === '')
                                        regionAreaCode = 0;

                                    combo.extendedStore = container.featureFramework.Execute('/KLADRFeature/GetCities', { 'StateCode': stateCode, 'RegionAreaCode': regionAreaCode });
                                }
                                combo.storeLoaded = true;
                            }
                            var store = obj.query == '' ? ['Не выбрано'] : [];
                            for (var i = 0; i < combo.extendedStore.length; i++) {
                                if (obj.query == '' || combo.extendedStore[i].Name.toUpperCase().indexOf(obj.query.toUpperCase()) == 0)
                                    store[store.length] = combo.extendedStore[i].Name;
                            }
                            combo.bindStore(store);
                        },
                        select: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.cityCode = container.findSelectedValue(obj);

                            // очистка других контролов, включая сторы
                            var townsCombo = Ext.getCmp('AdressTown' + obj.containerID);
                            townsCombo.clearValue();
                            townsCombo.extendedStore = null;
                            townsCombo.storeLoaded = false;

                            var streetsCombo = Ext.getCmp('AdressStreet' + obj.containerID);
                            streetsCombo.clearValue();
                            streetsCombo.extendedStore = null;
                            streetsCombo.storeLoaded = false;

                            Ext.getCmp('AdressIndex' + obj.containerID).setValue('');
                            Ext.getCmp('AdressGNINMB' + obj.containerID).setValue('');

                            this.ownerCt.fireEvent('datachanged', this.ownerCt);
                        }
                    }
                },

                { xtype: 'displayfield', value: "Населенный пункт:", id: 'lblTown' + this.id, name: 'lblTown' + this.name, fieldClass: 'x-form-field' },
                {
                    xtype: 'combo',
                    vReadOnly: true,
                    id: 'AdressTown' + this.id,
                    name: 'AdressTown' + this.id,
                    allowBlank: true,

                    mode: 'local',
                    triggerAction: 'all',
                    forceSelection: this.forbidCustomAddress,

                    store: ['Не выбрано'],
                    containerID: this.id,
                    storeLoaded: false,
                    extendedStore: null,

                    listeners:
                    {
                        blur: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.fireEvent('datachanged', container);
                        },
                        beforequery: function (obj) {
                            var combo = obj.combo;
                            var container = Ext.getCmp(combo.containerID);
                            if (!combo.storeLoaded) {
                                if (container.featureFramework != null) {
                                    var stateCode = container.subjectCode;
                                    if (stateCode === '')
                                        stateCode = 0;

                                    var regionAreaCode = container.regionAreaCode;
                                    if (regionAreaCode === '')
                                        regionAreaCode = 0;

                                    var cityCode = container.cityCode;
                                    if (cityCode === '')
                                        cityCode = 0;
                                    combo.extendedStore = container.featureFramework.Execute('/KLADRFeature/GetTowns', { 'StateCode': stateCode, 'RegionAreaCode': regionAreaCode, 'CityCode': cityCode });
                                }
                                combo.storeLoaded = true;
                            }
                            var store = obj.query == '' ? ['Не выбрано'] : [];
                            for (var i = 0; i < combo.extendedStore.length; i++) {
                                if (obj.query == '' || combo.extendedStore[i].Name.toUpperCase().indexOf(obj.query.toUpperCase()) == 0)
                                    store[store.length] = combo.extendedStore[i].Name;
                            }
                            combo.bindStore(store);
                        },
                        select: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.townCode = container.findSelectedValue(obj);

                            // очистка других контролов, включая сторы
                            var streetsCombo = Ext.getCmp('AdressStreet' + obj.containerID);
                            streetsCombo.clearValue();
                            streetsCombo.extendedStore = null;
                            streetsCombo.storeLoaded = false;

                            Ext.getCmp('AdressIndex' + obj.containerID).setValue('');
                            Ext.getCmp('AdressGNINMB' + obj.containerID).setValue('');

                            this.ownerCt.fireEvent('datachanged', this.ownerCt);
                        }
                    }
                },

                { xtype: 'displayfield', value: "Улица:", id: 'lblStreet' + this.id, name: 'lblStreet' + this.name, fieldClass: 'x-form-field' },
                {
                    xtype: 'combo',
                    vReadOnly: true,
                    id: 'AdressStreet' + this.id,
                    name: 'AdressStreet' + this.id,
                    allowBlank: true,

                    mode: 'local',
                    triggerAction: 'all',
                    forceSelection: false, // на случай если улицы в КЛАДРе случайно нет

                    store: ['Не выбрано'],
                    containerID: this.id,
                    storeLoaded: false,
                    extendedStore: null,

                    listeners:
                    {
                        blur: function (obj) {
                            var container = Ext.getCmp(obj.containerID);
                            container.fireEvent('datachanged', container);
                        },
                        beforequery: function (obj) {
                            var combo = obj.combo;
                            if (!combo.storeLoaded) {
                                var container = Ext.getCmp(combo.containerID);
                                combo.extendedStore = container.featureFramework != null ?
                                    container.featureFramework.Execute('/KLADRFeature/GetStreets', { 'KladrIndex': container.createKLADRCode() }) : [];
                                combo.storeLoaded = true;
                            }
                            var store = obj.query == '' ? ['Не выбрано'] : [];
                            var maxLength = 100;
                            for (var i = 0; i < combo.extendedStore.length; i++) {
                                if (obj.query == '' || combo.extendedStore[i].Name.toUpperCase().indexOf(obj.query.toUpperCase()) == 0)
                                    store[store.length] = combo.extendedStore[i].Name;
                                if (store.length == maxLength)
                                    break;
                            }
                            combo.bindStore(store);
                        },
                        select: function (obj) {
                            var index = Ext.getCmp(obj.containerID).findSelectedIndex(obj);

                            // Индекс и код административного деления
                            Ext.getCmp('AdressIndex' + obj.containerID).setValue('');
                            Ext.getCmp('AdressGNINMB' + obj.containerID).setValue('');

                            if (index >= 0) {
                                Ext.getCmp('AdressIndex' + obj.containerID).setValue(obj.extendedStore[index].Index);
                                Ext.getCmp('AdressGNINMB' + obj.containerID).setValue(obj.extendedStore[index].GNINMB);
                            }
                            this.ownerCt.fireEvent('datachanged', this.ownerCt);
                        }
                    }
                },

            // Второй слобец
                { xtype: 'displayfield', value: "Индекс:", fieldClass: 'x-form-field', id: 'lblIndex' + this.id, name: 'lblIndex' + this.name, style: { textAlign: 'right', paddingBottom: '7px' } },
                { xtype: 'textfield', vReadOnly: true, id: 'AdressIndex' + this.id, name: 'AdressIndex' + this.id, allowBlank: true, toValidate: this.addressValidatorBlock, listeners: { blur: function (obj) { this.ownerCt.fireEvent('datachanged', this.ownerCt); } } },

                { xtype: 'displayfield', value: "Код терр. деления:", fieldClass: 'x-form-field', id: 'lblGNINMB' + this.id, name: 'lblGNINMB' + this.name, style: { textAlign: 'right', paddingBottom: '7px' } },
                { xtype: 'textfield', vReadOnly: true, id: 'AdressGNINMB' + this.id, name: 'AdressGNINMB' + this.id, allowBlank: true, listeners: { blur: function (obj) { this.ownerCt.fireEvent('datachanged', this.ownerCt); } } },

                { xtype: 'displayfield', value: "Дом:", fieldClass: 'x-form-field', id: 'lblHouse' + this.id, name: 'lblHouse' + this.name, style: { textAlign: 'right', paddingBottom: '7px' } },
                { xtype: 'textfield', vReadOnly: true, id: 'AdressHouse' + this.id, name: 'AdressHouse' + this.id, allowBlank: true, toValidate: this.addressValidatorBlock, otherField: 'AdressCity' + this.id, listeners: { blur: function (obj) { this.ownerCt.fireEvent('datachanged', this.ownerCt); } } },

                { xtype: 'displayfield', value: "Корпус/строение:", fieldClass: 'x-form-field', id: 'lblBuilding' + this.id, name: 'lblBuilding' + this.name, style: { textAlign: 'right', paddingBottom: '7px' } },
                { xtype: 'textfield', vReadOnly: true, id: 'AdressBuilding' + this.id, name: 'AdressBuilding' + this.id, allowBlank: true, listeners: { blur: function (obj) { this.ownerCt.fireEvent('datachanged', this.ownerCt); } } },

                { xtype: 'displayfield', value: "Квартира/Офис:", fieldClass: 'x-form-field', id: 'lblRoom' + this.id, name: 'lblRoom' + this.name, style: { textAlign: 'right', paddingBottom: '7px' } },
                {
                    xtype: 'textfield', vReadOnly: true, id: 'AdressRoom' + this.id, name: 'AdressRoom' + this.id, allowBlank: true,
                    listeners:
                    {
                        'blur': function () {
                            if (this.ownerCt.canHide) this.ownerCt.hide();
                            this.ownerCt.fireEvent('datachanged', this.ownerCt);
                        }
                    }
                }
            ]
        });

        Virtu.Plugins.AddressPanel.superclass.initComponent.call(this);     // вызываем метод инициализации предка

        this.addEvents('datachanged');
    },

    // Сеттеры и геттеры
    // Поскольку появился КЛАДР, то все становится гораздо интереснее

    // КЛАДР
    getKLADRCode: function () {
        this.createKLADRCode();
        return this.KLADRCode;
    },
    setKLADRCode: function (value, e) {
        this.KLADRCode = value;
        try {
            this.subjectCode = parseInt(value.substr(0, 2), 10);
            this.regionAreaCode = parseInt(value.substr(2, 3), 10);
            this.cityCode = parseInt(value.substr(5, 3), 10);
            this.townCode = parseInt(value.substr(8, 3), 10);
        }
        catch (e) {
        }
    },

    // Субъект
    getSubject: function () {
        var subject = Ext.getCmp('AdressSubject' + this.id);
        return subject.getValue() != '' || this.subjectCode != '' ? subject.lastSelectionText : '';
    },
    setSubject: function (value, e) {
        Ext.getCmp('AdressSubject' + this.id).setValue(value, e);
    },

    // Район
    getRegionArea: function () {
        var RegionArea = Ext.getCmp('AdressRegionArea' + this.id);
        return RegionArea.getValue() != '' || this.regionAreaCode != '' ? RegionArea.lastSelectionText : '';
    },
    setRegionArea: function (value, e) {
        Ext.getCmp('AdressRegionArea' + this.id).setValue(value, e);
    },

    // Город
    getCity: function () {
        var city = Ext.getCmp('AdressCity' + this.id);
        return city.getValue() != '' || this.cityCode != '' ? city.lastSelectionText : '';
    },
    setCity: function (value, e) {
        Ext.getCmp('AdressCity' + this.id).setValue(value, e);
    },

    // Населенный пункт
    getTown: function () {
        var town = Ext.getCmp('AdressTown' + this.id);
        return town.getValue() != '' || this.townCode != '' ? town.lastSelectionText : '';
    },
    setTown: function (value, e) {
        Ext.getCmp('AdressTown' + this.id).setValue(value, e);
    },

    // Улица
    getStreet: function () {
        var street = Ext.getCmp('AdressStreet' + this.id);
        return street.getValue() != '' ? street.lastSelectionText : '';
    },
    setStreet: function (value, e) {
        Ext.getCmp('AdressStreet' + this.id).setValue(value, e);
    },

    // Индекс
    getIndex: function () { return Ext.getCmp('AdressIndex' + this.id).getValue(); },
    setIndex: function (value, e) { Ext.getCmp('AdressIndex' + this.id).setValue(value, e); },

    // Код территориального деления
    getGNINMB: function () { return Ext.getCmp('AdressGNINMB' + this.id).getValue(); },
    setGNINMB: function (value, e) { Ext.getCmp('AdressGNINMB' + this.id).setValue(value, e); },

    // Дом
    getHouse: function () { return Ext.getCmp('AdressHouse' + this.id).getValue(); },
    setHouse: function (value, e) { Ext.getCmp('AdressHouse' + this.id).setValue(value, e); },

    // Корпус
    getBuilding: function () { return Ext.getCmp('AdressBuilding' + this.id).getValue(); },
    setBuilding: function (value, e) { Ext.getCmp('AdressBuilding' + this.id).setValue(value, e); },

    // Квартира
    getApartment: function () { return Ext.getCmp('AdressRoom' + this.id).getValue(); },
    setApartment: function (value, e) { Ext.getCmp('AdressRoom' + this.id).setValue(value, e); }
});


Virtu.Plugins.Address = Ext.extend(Ext.Container,
{
    addressValidatorBlock: undefined,
    onHideFocusObjectId: undefined,                                         // Это тот объект, который получит фокус после ввода адреса [Ext.getCmp(this.onHideFocusObjectId).focus()]
    hidden: false,                                                          // Этот компонент по-умолчанию видее
    padding: '0 0 0 0',
    bodyStyle: "background-color:#ffffff",
    layout: 'absolute',                                                     // Размещаем компоненты с помощью абсолютного позиционирования
    defaults: { style: { margin: '0px 0px 0px 0px' } },
    colspan: 4,                                                             // Компонент занимает 4 ячейки таблицы (это значение по-умолчанию создано для лёгкого определения компонента в таблице с четырьмя колонками)
    columnX: [0, 151, 572, undefined, undefined, 5],
    // поля видимой формы справа, начало отображения поля, ширина поля
    // (не заданы элементы: отступ скрытой панели справа,
    // ширина панели [по умолчанию оба элемента совпадают с элементами 1 и 2, если не знаданы или заданы undefined, будут принудительно приравнены к ним]),
    // отступ элементов справа (поля справа) [в настоящий момент данное число не используется при отрисовке]
    columnH: [22, 5, 5],
    // высота поля, поля (отступы) сверху, отступ выравнивания по вертикали для текста надписи
    // (иначе надпись будет выравнена по верхнему краю и будет сильно приподнята относительно текстового поля)
    noAdress: false,                                                        // По-умолчанию рядом с полем отображения адреса выводится надпись "Адрес страхователя:"
    fullWidth: false,                                                       // По-умолчанию, компонент ввода занимает только ту ширину,
    // которую занимает поле отображения адреса, а не растянуто на всю ширину данного контейнера
    panelColumnH: [3, 24, 5],                                               // Записывается в AddressPanel в поле columnH
    // Эта строка выводится серым в поле отображения адреса в случае, если адрес ещё не введён
    emptyText: "Нажмите для отображения панели ввода адреса",
    adressLabelText: "Адрес регистрации:",                                 // Это надпись рядом с компонентом отображения адреса, отображается только в случае noAdress: false
    allowBlank: false,
    topH: 0,
    canHide: true,
    featureFramework: null,
    kladrCode: '',
    fillAdress:
        function () {
            var address = Ext.getCmp("_" + this.id).createAdress();
            this.kladrCode = Ext.getCmp('_' + this.id).createKLADRCode();
            var cmp = Ext.getCmp('InsurerAddress' + this.id);
            cmp.setValue(address);                                          // Заполняем поле отображения адреса вычисленным значением
            this.fireEvent('datachanged', this);

            return cmp;
        },

    hidefunc: function (o, obj) {
        if (!this.canHide) return;
        this.setHeight(this.columnH[0] + this.columnH[1] + this.topH - 6);

        if (this.forbidCustomAddress) this.fillAdress();

        if (this.onHideFocusObjectId)                                       // Переводим фокус на другой компонент
        {
            var nextComponent = Ext.getCmp(this.onHideFocusObjectId);
            nextComponent.focus();
        }
    },

    clear:
        function () {
            Ext.getCmp("_" + this.id).clear();
            Ext.getCmp('InsurerAddress' + this.id).setValue('');
            this.fireEvent('datachanged', this);
        },

    isNotEmpty:
        function () {

            return this.fillAdress().getValue() != '';
        },

    onRender: function (ct, p) {
        Virtu.Plugins.Address.superclass.onRender.call(this, ct, p);

        var w = this.columnX[0] + this.columnX[1] + this.columnX[2] + this.columnX[5];
        this.width = w;
        this.setSize(w, this.columnH[0] + this.columnH[1] + this.topH - 6); //немного уменьшил высоту (- 6)        // Если этого кода нет, то или ширина неправильно устанавливается при вываливании панели ввода адреса в ExpandedRowsGrid,
        // или компонент имеет формальную нулевую высоту, фактически налезая следующий за ним компонент. Установка размеров отдельными функциями
        // невозможна, т.к. или ширина будет неправильна (сброшена при установке высоты),
        // или будет неправильна высота (сброшена при установке ширины). Почему происходится сброс не выяснено
    },

    expandAddress: function () {
        if (!this.rendered)
            return;



        //  Ext.Msg.alert('Внимание!', 'Покупатель уведомлен, что <b>наступление инвалидности у ребенка НЕ считается страховым событием до 3-х летнего возраста</b>');

        var addressPanel = Ext.getCmp("_" + this.id);           // Получаем объект, представляющий панель ввода адреса

        addressPanel.width = this.columnX[2];               // почему-то функция setWidth в одиночку не работает
        addressPanel.setWidth(this.columnX[2]);

        // Устанавливаем высоту панели без учёта высоты заголовка
        // (высота заголовка, получаемая .getFrameHeight() не нулевая только в Internet Explorer)
        // Если высоту заголовка не учесть, то само содержимое панели будет меньше, чем надо, ровно на высоту заголовка
        addressPanel.setHeight(addressPanel.height + addressPanel.getFrameHeight());

        // Расширяем наш компонент в высоту, чтобы компоненты ниже сдвинулись; иначе панель ввода плюхнется прямо на них
        this.setHeight(this.columnH[0] + addressPanel.height + addressPanel.columnH[1] + this.topH);
        addressPanel.show();
        addressPanel.el.dom.style.display = 'block';                // Принудительно показываем панель для Google Chrome

        Ext.getCmp('AdressSubject' + addressPanel.id).focus(true);  // Устанавливаем фокус на поле ввода страны

    },
    //    clearInvalid: function() {
    //        Ext.getCmp('InsurerAddress' + this.id).clearInvalid();
    //    },
    initComponent: function () {
        while (this.columnX.length < 6)                                         // Дополняем массив настроек координат до нужного размера, если пользователем был указан обрезанный массив
            this.columnX.push(undefined);

        if (this.columnX[3] == undefined)                                       // Доинициализируем массив настроек координат
            this.columnX[3] = this.columnX[1];
        if (this.columnX[4] == undefined)
            this.columnX[4] = this.columnX[2];
        if (this.columnX[5] == undefined)
            this.columnX[5] = 5;

        var w = this.columnX[0] + this.columnX[1] + this.columnX[2] + this.columnX[5];
        this.setWidth(w);
        this.setHeight(this.columnH[0]);                                        // Устанавливаем заданную высоту (высота одной строки-поля вывода адреса)

        var newItems = [];
        var curX = this.columnX[0];
        if (!this.noAdress) {
            newItems.push
            ({
                xtype: 'displayfield', value: this.adressLabelText, fieldClass: 'x-form-field', x: curX, y: this.columnH[2] + this.topH, width: this.columnX[1], valign: 'bottom'
            });
            curX = this.columnX[1];
        }

        newItems.push
        ({
            xtype: 'textfield', readOnly: true, colspan: 3, id: 'InsurerAddress' + this.id, name: 'InsurerAddress' + this.id, emptyText: this.emptyText, toValidate: this.addressValidatorBlock, allowBlank: this.allowBlank, //vtype: 'fillfield_accept',
            listeners: {
                'focus': {                                                              // При фокусе на поле отображения адреса разворачиваем или сворачиваем панель ввода адреса
                    fn: function () {
                        var addressPanel = Ext.getCmp("_" + this.ownerCt.id);           // Получаем объект, представляющий панель ввода адреса

                        //console.log("123");

                        if (addressPanel.hidden) {
                            addressPanel.width = this.ownerCt.columnX[2];               // почему-то функция setWidth в одиночку не работает
                            addressPanel.setWidth(this.ownerCt.columnX[2]);
                            // this.readOnly = false;
                            // Устанавливаем высоту панели без учёта высоты заголовка
                            // (высота заголовка, получаемая .getFrameHeight() не нулевая только в Internet Explorer)
                            // Если высоту заголовка не учесть, то само содержимое панели будет меньше, чем надо, ровно на высоту заголовка
                            addressPanel.setHeight(addressPanel.height + addressPanel.getFrameHeight());

                            // Расширяем наш компонент в высоту, чтобы компоненты ниже сдвинулись; иначе панель ввода плюхнется прямо на них
                            this.ownerCt.setHeight(this.ownerCt.columnH[0] + addressPanel.height + addressPanel.columnH[1] + this.ownerCt.topH);
                            addressPanel.show();
                            addressPanel.el.dom.style.display = 'block';                // Принудительно показываем панель для Google Chrome

                            Ext.getCmp('AdressSubject' + addressPanel.id).focus(true);  // Устанавливаем фокус на поле ввода страны
                        }
                        else {
                            if (!this.canHide) return;
                            addressPanel.hide();
                            // this.ownerCt.hidefunc(); // И так вызовется при обработке события 'hide'
                        }
                    }
                }
            },
            x: curX, y: 0 + this.topH, width: this.columnX[2]
        });

        curX = this.columnX[0];
        if (!this.fullWidth) {
            newItems.push
            ({
                xtype: 'hidden', id: 'InsurerID' + this.id, fieldClass: 'x-form-field',
                x: curX, y: this.columnH[0] + this.columnH[2] + this.topH, width: this.columnX[3]
            });
            curX = this.columnX[3];
        }

        newItems.push({
            xtype: 'Virtu.Plugins.AddressPanel',
            id: "_" + this.id,
            fieldClass: 'x-form-field',
            canHide: this.canHide,
            addressValidatorBlock: this.addressValidatorBlock,
            featureFramework: this.featureFramework,
            x: curX,
            y: this.columnH[0] + this.topH/* + this.columnH[1]*/,
            width: this.columnX[4],
            height: this.columnH[0],
            columnH: this.panelColumnH,
            listeners:
            {
                'hide': function () {
                    this.ownerCt.setHeight(this.ownerCt.columnH[0]);
                    this.ownerCt.hidefunc();
                },
                'datachanged': function (obj) {
                    this.ownerCt.fillAdress();
                    this.ownerCt.fireEvent('datachanged', obj.ownerCt);
                }
            },
            forbidCustomAddress: false
        });

        Ext.applyIf(this,
            {
                items: newItems
            }
        );
        Virtu.Plugins.Address.superclass.initComponent.call(this);

        this.addEvents('datachanged');
    },

    getAddressPanel: function () { return Ext.getCmp("_" + this.id); },

    getFullAddress: function () { return Ext.getCmp('InsurerAddress' + this.id).getValue(); },
    setFullAddress: function (value) { Ext.getCmp('InsurerAddress' + this.id).setValue(value); },

    getValue: function () {
        var panel = this.getAddressPanel();
        return {
            FullAddress: this.getFullAddress(),
            Subject: panel.getSubject(),
            RegionArea: panel.getRegionArea(),
            City: panel.getCity(),
            Town: panel.getTown(),
            Street: panel.getStreet(),
            Index: panel.getIndex(),
            GNINMB: panel.getGNINMB(),
            House: panel.getHouse(),
            Building: panel.getBuilding(),
            Apartment: panel.getApartment(),
            KLADRCode: panel.getKLADRCode()
        };
    },

    setValue: function (value) {
        this.setFullAddress(value != null && value.FullAddress != null ? value.FullAddress : '');

        var panel = this.getAddressPanel();
        panel.setSubject(value != null && value.Subject != null ? value.Subject : '', false);
        panel.setRegionArea(value != null && value.RegionArea != null ? value.RegionArea : '', false);
        panel.setCity(value != null && value.City != null ? value.City : '', false);
        panel.setTown(value != null && value.Town != null ? value.Town : '', false);
        panel.setStreet(value != null && value.Street != null ? value.Street : '', false);
        panel.setIndex(value != null && value.Index != null ? value.Index : '', false);
        panel.setGNINMB(value != null && value.GNINMB != null ? value.GNINMB : '', false);
        panel.setHouse(value != null && value.House != null ? value.House : '', false);
        panel.setBuilding(value != null && value.Building != null ? value.Building : '', false);
        panel.setApartment(value != null && value.Apartment != null ? value.Apartment : '', false);
        panel.setKLADRCode(value != null && value.KLADRCode != null ? value.KLADRCode : '', false);

    }
});



Virtu.Features.Feature.registerClass('Virtu.Plugins.AddressPanel', null, Sys.IDisposable);
Ext.reg('Virtu.Plugins.AddressPanel', Virtu.Plugins.AddressPanel);

Virtu.Features.Feature.registerClass('Virtu.Plugins.Address', null, Sys.IDisposable);
Ext.reg('Virtu.Plugins.Address', Virtu.Plugins.Address);

// Notify ScriptManager that this is the end of the script.
if (typeof (Sys) !== "undefined")
    Sys.Application.notifyScriptLoaded();
