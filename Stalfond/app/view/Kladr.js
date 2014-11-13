/**
 * @class MyApp.view.Kladr
 * @extends Ext.container.Container
 *
 * Форма КЛАДР
 */
Ext.define('VLib.view.override.Kladr', {
    requires: 'Stalfond.view.Kladr'
}, function() {
    Ext.override(Stalfond.view.Kladr, {

        /**
         * @event change
         * Случилось изменение адреса.
         * @param {MyApp.view.Kladr} el
         * @param {Object} data
         */

        /**
         * Этот компонент следует выключать и включать каскадно.
         * @property disableMeCascade
         * @type {boolean}
         */
        disableMeCascade: true,

        readOnly: false,

        defaults: {
            //Дочерние элементы не должны быть связаны с хранилищем полиса,
            //Либо это должно происходить осознанно.
            bindToModel: false,
            queryMode: 'remote'
        },

        bindToModel: true,

        /**
         * Шаблон генерирует строку для полного адреса.
         * @property KLADR_template
         * @type {Array}
         */

        /**
         * Коллекция ошибок.
         * @property errors
         * @type {Array}
         */
        errors: null,

        /**
         * Ссылки на поля кладра см. {@link MyApp.view.Kladr.getField}
         * @property refFields
         * @type {Object}
         */
        refFields: null,

        /**
         * Данные формы см. {@link MyApp.view.Kladr.getValue}
         * @property data
         * @type {Object}
         */
        data: null,

        /**
         * @cfg {String/Function} mode Режим работы из встроенных на данный момент только: 'Full', 'UsageRegion'
         */
        mode: 'Full',

        /**
         * @cfg {boolean} expanded если ture при запуске блок ввода адреса будет открыт иначе закрыт.
         */
        expanded: false,

        initComponent: function() {

            this.callParent(arguments);

            if (!this.KLADR_template)
                this.KLADR_template = '<tpl if="Index">{Index}, </tpl><tpl if="Subject">{Subject}</tpl><tpl if="RegionArea">,' +
                    ' {RegionArea}</tpl><tpl if="City">, {City}</tpl><tpl if="Town">, {Town}</tpl><tpl if="Street">, {Street}</tpl><tpl if="House">,' +
                    ' {House}</tpl><tpl if="Building">, {Building}</tpl><tpl if="Room">, {Room}</tpl>';

            if (Ext.isString(this.KLADR_template))
            {
                this.KLADR_template = new Ext.XTemplate(this.KLADR_template);
            }

            var me = this, menu = me.down('#menu');
            me.refFields = {};
            if (menu && !me.expanded)
                menu.hide();

            me.clearValue(true);

            Ext.each(me.query('[name]'), me.initChildFields, me);
            me.getField('FullAddress').onTriggerClick = me.onTriggerClick;
            me.getField('Street').addListener('select', this.onSelectStreet, this);
            me.setValue(me.data);

            if (typeof(me.mode) == 'string' && typeof(me['mode'+me.mode]) == 'function')
                this['mode'+me.mode]();

            if (typeof(me.mode) == 'function')
                me.mode();
        },

        /**
         * Обработка формы данный обработчик это просто затычка
         */
        modeFull: function() {},

        /**
         * Режим выбора региона. (Оставляем только выбор субъекта, города, населенного пункта и района)
         */
        modeUsageRegion: function() {
            var me = this, i, toHide = ['FullAddress', 'Street', 'Index', 'House', 'Building', 'GNINMB', 'Room'];

            for(i=0;toHide[i];i++)
                me.getField(toHide[i]).hide();

            me.getField('Subject').allowBlank = false;
        },

        /**
         * Отправляем данные обратно в модель.
         */
        dataBindHandler: function() {
            var me = this, r = me.record, value = me.getValue(true);
            if (me.bindToModel && r) {
                me.notTouchFromModelSet = true;
                r.silentSet(me.name, value);
                me.notTouchFromModelSet = false;
            }
        },

        /**
         * Инициализируем поле кладра, добавляем нужные обработчики событий, хранилища и заполняем ссылки refFields.
         * @param field {Ext.Component}
         */
        initChildFields: function(field) {
            this.refFields[field.name] = field;
            this.bindFieldStore(field);

            field.addListener('select',      this.onSelect, this);
            field.addListener('change',      this.onChange, this);
            field.addListener('beforequery', this.loadStore, this);

        },

        /**
         * Обработчик выбора субъекта/города/улицы
         *
         * @param field {Ext.form.field.ComboBox}
         * @param record {Ext.data.Store}
         */
        onSelect: function(field, record) {
            this.data[field.name + 'Code'] = record[0].get('Code');
            this.data[field.name]          = record[0].get('Name');
            this.clearFieldsByParentName(field.name);
            this.changeHandler();
        },

        /**
         * Обработчик изменения полей ввода адреса.
         * <i>При очистке комбобокса обновляет датасет компонента {@link MyApp.view.Kladr.data}</i>
         *
         * @param field {Ext.form.field.Base}
         * @param record {*}
         */
        onChange: function(field, value) {
            if (field.xtype != 'combobox')
                this.data[field.name] = value;
            else
                if (value == '' || value == null || value == undefined)
                {
                    if (value == '')
                        this.clearFieldsByParentName(field.name);

                    this.data[field.name + 'Code'] = 0;
                    this.data[field.name]          = '';
                }

            this.changeHandler();
        },

        /**
         * Специальный обработчик выбора для улицы, обнуляет индекс и код тер.деления.
         * @param field {Ext.form.field.ComboBox}
         * @param record {Ext.data.Store}
         */
        onSelectStreet: function(field, record)
        {
            this.getField('GNINMB').setValue(record[0].get('GNINMB'));
            this.getField('Index').setValue(record[0].get('Index'));
        },

        /**
         * Обработчик любого изменения в форме.
         */
        changeHandler: function()
        {
            var me = this;
            me.data.KLADRCode = me.getCode();
            me.getField('FullAddress').setValue(me.createFullAddress());
            me.dataBindHandler();
            me.fireEvent('change', me, me.getValue());
        },

        /**
         * Обработчик beforequery комбобокс. (грузим хранилище)
         * @param field {Object}
         */
        loadStore: function(field)
        {
            var store = field.combo.store;
            if (store.getCount() == 0)
                store.load();
        },

        /**
         * Открываем закрываем панель ввода адреса.
         * <i>Панель ввода адреса должна иметь itemId='menu'</i>
         */
        onTriggerClick: function() {
            var kladr = this.up('kladr'), menu = kladr.down('#menu');

            if (kladr.readOnly)
                return;

            if (menu && menu.isVisible())
            {
                menu.hide();
                this.expanded = false;
            }
            else
            {
                menu.show();
                this.expanded = true;
            }
        },

        /**
         * Поле доступно только для чтения да/нет
         * @param flag boolean
         */
        setReadOnly: function(flag)
        {
            flag = flag || false;
            this.readOnly = flag;

            if (flag)
            {
                this.down('#menu').hide();
                this.expanded = false;
            }
        },

        /**
         * Фабрика хранилищь, создаем хранилище для всех комбобоксов в компоненте.
         * <i>На входе нужно передать обработчик запроса.</i>
         *
         <pre><code>
            store = this.storeFactory(function(){
                return framework.Execute('/KLADRFeature/GetStates', {});
            });
         </code></pre>
         *
         * @param requestHandler {Function}
         * @return {Ext.data.ArrayStore}
         */
        storeFactory: function(requestHandler) {

            /*if (!MyApp.data && !MyApp.data.ProxyF)
                Ext.define('MyApp.data.ProxyF', {
                    extend: 'Ext.data.proxy.JsonP',
                    alias: ['proxy.jsonf'],
                    requires: ['Ext.data.proxy.Server']
                });*/

            return Ext.create('Ext.data.JsonStore', {
                idProperty : 'ID',
                fields     : ['Code', 'ID', 'Index', 'GNINMB', 'Name'],
                autoLoad   : false,
                kladr      : this,
                pageSize   : 25,
                data       : [],
                doRequest  : requestHandler,
                load       : function(cfg) {

                    var page = 1, start = 0;
                    cfg = cfg || {};

                    cfg = Ext.merge(cfg, {
                        params: {
                            limit: 25,
                            page: cfg.page || 1//,
                            //start: cfg.start || 0
                        }
                    });

                    this.loading = true;
                    var resp = this.doRequest(cfg.params);
                    this.removeAll();
                },
                fillModels: function(resp)
                {
                    var result = [], i = 0;
                    if (Ext.isArray(resp)) {
                        for (i; i < resp.length; i++) {
                            result[result.length] = this.createModel({
                                Code   : resp[i].Code ? resp[i].Code : resp[i].CodeStreet,
                                ID     : resp[i].ID,
                                Index  : resp[i].Index,
                                GNINMB : resp[i].GNINMB,
                                Name   : resp[i].Name
                            });
                        }
                    }

                    return result;
                },

                onProxyLoad: function(resp) {

                    if (resp.readyState != 4) {
                        return;
                    }

                    var me = this, respJson = JsonDeserialize(resp.responseText), result = respJson.Result,
                        resultSet = Ext.create('Ext.data.ResultSet', {
                            count: result.length,
                            total: respJson.total,
                            success: true,
                            loaded: true,
                            records: me.fillModels(result)
                        });

                    if (resultSet) {
                        me.totalCount = resultSet.total;
                    }

                    me.loading = false;
                    me.fireEvent('read', me, resultSet.records, true);
                    me.loadRecords(resultSet.records);
                    me.fireEvent('load', me, resultSet.records, true);
                }
            });
        },

        /**
         * Получение хранилища с субъектами РФ.
         * @return {Ext.data.ArrayStore}
         */
        getSubjectStore: function() {
            return this.storeFactory(function(params){
                return framework.Execute(
                    '/KLADRFeature/GetStates',
                    Ext.applyIf(params, {}),
                    this.onProxyLoad.bind(this));
            });
        },

        /**
         * Получение хранилища с регионами.
         * @return {Ext.data.ArrayStore}
         */
        getRegionAreaStore: function() {
            return this.storeFactory(function(params){
                if (!this.kladr.getSubjectCode()) return null;
                return framework.Execute(
                    '/KLADRFeature/GetRegionAreas',
                    Ext.applyIf(params, {'StateCode': this.kladr.getSubjectCode() }),
                    this.onProxyLoad.bind(this));
            });
        },

        /**
         * Получение хранилища с городами.
         * @return {Ext.data.ArrayStore}
         */
        getCityStore: function() {
            return this.storeFactory(function(params){
                if (!this.kladr.getSubjectCode() && !this.kladr.getRegionAreaCode()) return null;
                return framework.Execute(
                    '/KLADRFeature/GetCities',
                    Ext.applyIf(params, {'StateCode': this.kladr.getSubjectCode(), 'RegionAreaCode': this.kladr.getRegionAreaCode() }),
                    this.onProxyLoad.bind(this));
            });
        },

        /**
         * Получение хранилища с населенными пунктами.
         * @return {Ext.data.ArrayStore}
         */
        getTownStore: function() {
            return this.storeFactory(function(params){
                if (!this.kladr.getSubjectCode() && !this.kladr.getRegionAreaCode() && !this.kladr.getCityCode()) return null;
                return framework.Execute(
                    '/KLADRFeature/GetTowns',
                    Ext.applyIf(params, {'StateCode': this.kladr.getSubjectCode(), 'RegionAreaCode': this.kladr.getRegionAreaCode(), 'CityCode': this.kladr.getCityCode() }),
                    this.onProxyLoad.bind(this));
            });
        },

        /**
         * Получение хранилища с улицами.
         * @return {Ext.data.ArrayStore}
         */
        getStreetStore: function() {
            return this.storeFactory(function(params){
                if (this.kladr.getCode() == '000000000000000') return null;
                return framework.Execute(
                    '/KLADRFeature/GetStreets',
                    Ext.applyIf(params, {'KladrIndex': this.kladr.getCode().substring(0, 11) + '00' }),
                    this.onProxyLoad.bind(this));
            });
        },

        /**
         * Получение кода субъекта РФ.
         * @param lz {number/undefined} длинна возращаемой строки, недостающее будет заполнено ведущими нулями
         * @return {String}
         */
        getSubjectCode: function(lz) {
            return this.leadingZeros(this.data.SubjectCode || 0, lz);
        },

        /**
         * Получение кода региона.
         * @param lz {number/undefined} длинна возращаемой строки, недостающее будет заполнено ведущими нулями
         * @return {String}
         */
        getRegionAreaCode: function(lz) {
            return this.leadingZeros(this.data.RegionAreaCode || 0, lz);
        },

        /**
         * Получение кода города.
         * @param lz {number/undefined} длинна возращаемой строки, недостающее будет заполнено ведущими нулями
         * @return {String}
         */
        getCityCode: function(lz) {
            return this.leadingZeros(this.data.CityCode || 0, lz);
        },

        /**
         * Получение кода населенного пункта.
         * @param lz {number/undefined} длинна возращаемой строки, недостающее будет заполнено ведущими нулями
         * @return {String}
         */
        getTownCode: function(lz) {
            return this.leadingZeros(this.data.TownCode || 0, lz);
        },

        /**
         * Получение кода улицы.
         * @param lz {number/undefined} длинна возращаемой строки, недостающее будет заполнено ведущими нулями
         * @return {String}
         */
        getStreetCode: function(lz) {
            return this.leadingZeros(this.data.StreetCode || 0, lz);
        },

        /**
         * Получение поля кладра по имени.
         * @param name {String}
         * @return {Ext.Component}
         */
        getField: function(name) {
            return this.refFields[name];
        },

        /**
         * Прикручиваем хранилище к соответствующему стору.
         * @param field {Ext.Component}
         */
        bindFieldStore: function(field) {
            var alias = {
                Subject    : 'getSubjectStore',
                RegionArea : 'getRegionAreaStore',
                City       : 'getCityStore',
                Town       : 'getTownStore',
                Street     : 'getStreetStore'
            };

            if (field.bindStore && alias[field.name])
            {
                field.bindStore(this[alias[field.name]]());
            }
        },

        /**
         * Получение полного КЛАДР кода.
         * @return {String}
         */
        getCode: function() {
            var me = this;
            return me.getSubjectCode(2) + me.getRegionAreaCode(3) + me.getCityCode(3) + me.getTownCode(3) + me.getStreetCode(4);
        },

        /**
         * Последовательно затираем поля ввода адреса начиная с того которое было указано.
         * <i>Последовательность затирания: 'RegionArea', 'City', 'Town', 'Street', 'Index', 'GNINMB'</i>
         *
         <pre><code>
            this.clearFieldsByParentName(City);
            //Очистит поля: 'Town', 'Street', 'Index', 'GNINMB'...
         </code></pre>
         * @param name {String} Имя поля
         */
        clearFieldsByParentName: function(name)
        {
            var names     = ['RegionArea', 'City', 'Town', 'Street', 'Index', 'GNINMB'],
                fromIndex = {'Subject': 0, 'RegionArea': 1, 'City': 2, 'Town': 3, 'Street': 4},
                i = fromIndex[name];

            if (i != undefined) for(i;i<names.length;i++) this.clearField(names[i])
        },

        /**
         * Очищаем названное поле.
         * @param name {String} Имя поля
         */
        clearField: function(name)
        {
            var field = this.getField(name);
            if (field.xtype == 'combobox')
            {
                field.clearValue();
                field.getStore().removeAll();
            }
            else
            {
                field.setValue('');
            }
        },

        /**
         * Сбор полного адреса для поля триггера FullAddress.
         * @return {String}
         */
        createFullAddress: function() {
            var tmpl = ['Index', 'Subject', 'RegionArea', 'City', 'Town', 'Street', 'House', 'Building', 'Room'],
                result = [], i= 0;

            for (i;tmpl[i];i++)
                if (this.data[tmpl[i]]) result.push(this.data[tmpl[i]]);

            return this.KLADR_template.apply({
                Index:     this.data['Index'],
                Subject:   this.data['Subject'],
                RegionArea:this.data['RegionArea'],
                City:      this.data['City'],
                Town:      this.data['Town'],
                Street:    this.data['Street'],
                House:     this.data['House'],
                Building:  this.data['Building'],
                Room:      this.data['Room']
            });
        },

        /**
         * Добавляем ведущие нули.
         * //TODO Вынести в общий функцианал
         * @param value {number}
         * @param len {number} - Предпологаемая минимальная длинна строки
         * @return {*}
         */
        leadingZeros: function(value, len) {
            if (!len) return value;
            if (value == undefined) return 0;
            var n = '00000000000000000000000000000000000000000000000000000000000',
                v = value.toString(), preflen = len - v.length;
            if (preflen > 0) v = (n.substring(0, preflen)).toString() + v;
            return v;
        },

        /**
         * Стандартная валидация с учетом типа действия.
         * @param actionName {string}
         */
        isValid: function(actionName) {
            var me = this;
            me.errors = [];

            if (me.isDisabled())
                return true;

            if (!Ext.isFunction(me.validator))
            {
                /*Ext.each(me.query('[isValid]'), function(field){
                    if (!field.isValid())
                    {
                        me.errors = Ext.Array.merge(me.errors, field.getErrors());
                    }
                });

                return me.errors.length == 0;*/

                var result = me.kladrValidator(me.getValue());
            }
            else
            {
                var result = me.validator(me.getValue());
            }

            me.errors = Ext.Array.merge(me.errors, result);
            return result === true;
        },

        /**
         * Получить список ошибок кладра.
         * @return {*}
         */
        getErrors: function()
        {
            return this.errors;
        },

        /**
         * Получаем данные формы КЛАДР.
         * @return {Object}
         */
        getValue: function()
        {
            return this.data;
        },

        /**
         * Устанавливаем данные в форму КЛАДР.
         * @param obj
         */
        setValue: function(obj)
        {
            this.clearValue(true);

            if (obj)
            {
                for (var i in obj)
                {
                    var field = this.getField(i);
                    if (field)
                    {
                        field.setRawValue(obj[i]);
                        field.lastValue = obj[i];
                    }
                }
                this.data = obj;
            }
            this.changeHandler();
        },

        /**
         * Обнуляем значение поля.
         * @param silent {boolean} Очищаем без вызова соответсвующих событий?
         */
        clearValue: function(silent)
        {
            this.data = {
                Apartment: '', Building: '', FullAddress: '', GNINMB: '', House: '', Index: '',
                KLADRCode: '000000000000000000', Subject: '', RegionArea: '', City: '', Street: '', Town: '',
                SubjectCode: 0, RegionAreaCode: 0, CityCode: 0, StreetCode: 0, TownCode: 0
            };

            if (!silent)
                this.changeHandler();
        },

        kladrValidator: function(v) {
            var fa = this.down('trigger[name=FullAddress]'), err = 'Это поле обязательно для заполнения';
            if (v.FullAddress == '') {
                return err;
            }
            return true;
        },

        setAllowBlank: function(v){
            var fa = this.down('trigger[name=FullAddress]');
            fa.allowBlank = v;
        }
    });
});