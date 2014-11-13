/// <reference name="MicrosoftAjax.js"/>
/// <reference path="~/Scripts/Ext/adapter/ext/ext-base.js"/>
/// <reference path="~/scripts/Ext/ext-all.js"/>
var DateDiff = {
    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },

    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function(d1, d2) {
        var val = 0;

        if (d1 && d2) {
            var val = d2.getFullYear() - d1.getFullYear();
            if (val < 0) {
                val = val * -1;
            }
        }

        return val;
    }
};
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};
function numFormat(a, currency) {
    if (!a) return '';
    // if (!currency) currency = "RUR";
    return a.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}

var getClassifierFromList = function(classifierList, clsID) {
    if (classifierList == null) return null;
    for (var i = 0; i < classifierList.length; i++)
        if (classifierList[i] != null && classifierList[i][0] != null && classifierList[i][0].ClassifierID == clsID.toLowerCase()) return classifierList[i];
    return null;
};

var classifierStore = function(response, clsID, useCODE, emptyValue) {
    var store;
    var cls;
    cls = getClassifierFromList(response.classifierList, clsID);
    if (cls == null) store = [[]];
    else {
        store = [];
        for (var i = 0; i < cls.length; i++) {
            store[store.length] = [useCODE ? cls[i].CODE : cls[i].ID.toUpperCase(), cls[i].Name];
        }
    }
    if (emptyValue) {
        store.unshift([0, emptyValue]);
    }
    return store;
};

var tariffStore = function(tableName, valueMember, displayMember, emptyValue, response) {
    var store;
    var cls = eval(response.tarifList[tableName]);
    if (cls == null) store = [[]];
    else {
        store = [];
        for (var i = 0; i < cls.length; i++) {
            store[store.length] = [cls[i][valueMember].value, cls[i][displayMember].value];
        }
    }
    if (emptyValue) {
        store.unshift([0, "<Не выбрано>"]);
    }
    return store;
};

function c_durationStore(min, max, postFix) {
    var store = [];
    for (var t = min; t <= max; t++) {
        store[store.length] = [t, t + (postFix || '')];
    }
    return store;
}

// Vtype for phone number validation
Ext.apply(Ext.form.VTypes,
{
    'phoneText': 'Неверный формат  номера телефона, количество знаков должно быть не более 10.',
    'phoneMask': /[\-\+0-9\(\)\s\.Ext]/,
    'phoneRe': /^\+7 (\({1}[0-9]{3}\){1}\s{1})([0-9]{3}[-]{1}[0-9]{4})$|^(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{4}){3}$|^Ext. [0-9]+$/,
    'phone': function(v) {
        return this.phoneRe.test(v);
    }
});


// Function to format a phone number
Ext.apply(Ext.util.Format,
{
    phoneNumber: function(value) {
        var phoneNumber = value.replace(/\./g, '').replace(/-/g, '').replace(/[^0-9]/g, '');

        if (phoneNumber != '' && phoneNumber.length == 10) {
            return '+7 (' + phoneNumber.substr(0, 3) + ') ' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6, 4);
        }
        else {
            return value;
        }
    }
});

Ext.namespace('Ext.ux.plugin');

// Plugin to format a phone number on value change
Ext.ux.plugin.FormatPhoneNumber = Ext.extend(Ext.form.TextField,
{
    init: function(c) {
        c.on('change', this.onChange, this);
    },
    onChange: function(c) {
        c.setValue(Ext.util.Format.phoneNumber(c.getValue()));
    }
});

// TODO Bind mode: oneWay|twoWay
function formToObject(frm) {
    var obj = new Object();
    var ctrls = frm.find("bind", true);
    for (var i = 0; ctrls[i] != undefined; i++) {
        var value = null;
        try {
            value = ctrls[i].getValue();
        }
        catch (e)
        { }

        if (value instanceof Ext.form.Radio) {
            value = value.inputValue;
        }
        if (value instanceof Date) {
            value = dateToStr(value);
        }
        obj[ctrls[i].id] = value;
        if (ctrls[i].rawValue) obj[ctrls[i].id + "Raw"] = ctrls[i].getRawValue();
        if (ctrls[i].flatValue) obj = flattenObjects(obj, [value], ctrls[i].id);

    }
    return obj;
}

function dateToStr(d, f) {
    if (!d) return "";
    if (!f) f = "yyyy-MM-dd";
    return d.toString(f);
}

function toPrintableDate(d) {
    if (d) {
        try {
            var strDate = d;
            if (strDate.indexOf("-") !== -1) {
                var dateParts = strDate.split("-");
                // предполагается что входящая дата в формате YYYY-MM-DD
                var date = new Date(parseInt(dateParts[0] - 0), parseInt(dateParts[1] - 1), parseInt(dateParts[2] - 0));
                return dateToStr(date, "dd.MM.yyyy");
            }

        }
        catch (e)
        { }
    }
    return d;
}

function objectToForm(obj, frm) {
    var ctrls = frm.find("bind", true);

    // defaults
    for (var i = 0; ctrls[i] != undefined; i++) {
        if (ctrls[i].value === undefined) {
            value = ctrls[i].defaultValue;
            if (value !== undefined) ctrls[i].setValue(value);
        }
    }

    // real values
    for (var i = 0; ctrls[i] != undefined; i++) {
        var value = obj[ctrls[i].id];
        if (value !== undefined && value !== "") ctrls[i].setValue(value);
    }
}

function newGUID() {
    var guid = "";
    for (var i = 0; i < 32; i++) {
        if (i == 8 || i == 12 || i == 16 || i == 20) {
            guid += '-';
        }
        guid += parseInt(Math.random() * 16).toString(16);
    }

    return guid;

}

function renderDate(value) {
    if (value == null) return "";
    return eval('new ' + ('' + value.replace("/", "").replace("/", "")) + '.localeFormat("dd-MM-yyyy")');
}

function flattenObjects(target, sourceArray, prefix) {
    if (!prefix) prefix = '';
    for (var x = 0; sourceArray[x] != undefined; x++) {
        for (var member in sourceArray[x]) {
            target[prefix + member] = sourceArray[x][member];
        }
    }

    return target;
}

function unflattenObject(target, prefix) {
    if (!prefix) prefix = '';
    var obj = new Object();
    for (var member in target) {
        if (member.indexOf(prefix) != -1) {
            var value = target[member];
            obj[member.toString().replace(prefix, '')] = value;
        }
    }
    return obj;
}

function bindStores(response, parent) {

    var ctrls = parent.findBy(function(c) {
        return (c.dataSource != undefined);
    });

    for (var i = 0; ctrls[i] != undefined; i++) {
        var id = ctrls[i].valueField || "ID";
        var text = ctrls[i].displayField || "Name";
        ctrls[i].bindStore(tariffStore(ctrls[i].dataSource, id, text, false, response));
        ctrls[i].valueField = 'field1';
        ctrls[i].displayField = 'field2';
    }

}

function setReadOnlyControls(parent, readOnly) {

    var ctrls = parent.findBy(function(c) {
        return (c.xtype == 'textfield' || c.xtype == 'textarea' || c.xtype == 'lovcombo' || c.xtype == 'textarea' || c.xtype == 'numberfield' || c.xtype == 'checkbox' || c.xtype == 'datefield' || c.xtype == 'combo' || c.xtype == 'radio' || c.xtype == 'radiogroup' || c.xtype == 'button');
    });

    for (var i = 0; ctrls[i] != null; i++) {
        if (ctrls[i].frozen) continue;
        switch (ctrls[i].xtype) {
            case "toolbar":
            case "button":
            case "radiogroup":
            case "radio":
            case "checkgroup":
            case "checkbox":
                ctrls[i].setDisabled(readOnly);
                break;
            default:
                ctrls[i].setReadOnly(readOnly);
        }
    }

    parent.readOnly = readOnly;

    if (parent.readOnlyChanged != undefined) parent.readOnlyChanged(parent, readOnly);
}

function setStoreData(store, data) {

    store.removeAll();

    if (data == undefined) return;

    var rt = store.recordType;

    for (var i = 0; data[i] != undefined; i++) {

        var ts = data[i];

        var tsRt = new rt({});

        var cnt = store.getCount();

        store.insert(cnt, tsRt);

        for (var member in ts) {

            tsRt.data[member] = ts[member];
        }

        tsRt.commit();
    }
}

Ext.override(Ext.form.RadioGroup,
{
    fireChecked: function() {
        this.bufferChecked();
    }
});



// Костыли для Ext'а
Ext.override(Ext.Component,
{
    disable: function( /* private */silent) {
        if (this.rendered) {
            this.onDisable();
        }
        this.disabled = true;

        if (silent !== true) {
            this.fireEvent('disable', this);
        }
        if (this.findBy != undefined) {
            var childItems = this.findBy(function(a) {
                return true;
            });
            for (var j = 0; childItems[j] != undefined; j++) {
                childItems[j].setDisabled(true);
            }
        }
        return this;
    },
    enable: function() {
        if (this.rendered) {
            this.onEnable();
        }

        this.disabled = false;
        
        if (this.findBy != undefined) {
            var childItems = this.findBy(function(a) {
                return true;
            });
            for (var j = 0; childItems[j] != undefined; j++) {
                childItems[j].setDisabled(false);
            }
        }
        this.fireEvent('enable', this);
        return this;
    }

});

/*
Ext.override(Ext.form.TextField,
{
    getErrors: function(value) {

        var errors = Ext.form.TextField.superclass.getErrors.apply(this, arguments);

        value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());

        if (Ext.isFunction(this.validator)) {
            var msg = this.validator(value);
            if (msg !== true) {
                errors.push(msg);
            }
        }

        if (value.length < 1 || value === this.emptyText) {
            if (this.allowBlank) {
                //if value is blank and allowBlank is true, there cannot be any additional errors
                return errors;
            }
            else {
                errors.push(this.blankText);
            }
        }

        if (!this.allowBlank && (value.length < 1 || value === this.emptyText)) { // if it's blank
            errors.push(this.blankText);
        }
        // если длина меньше установленной и allowBlank: true, то ошибка должна возникать только если данные вообще введены
        if ((!this.allowBlank || value.length > 0) && (value.length < this.minLength)) {

            errors.push(String.format(this.minLengthText, this.minLength));
        }

        if (value.length > this.maxLength) {
            errors.push(String.format(this.maxLengthText, this.maxLength));
        }

        if (this.vtype) {
            var vt = Ext.form.VTypes;
            if (!vt[this.vtype](value, this)) {
                errors.push(this.vtypeText || vt[this.vtype + 'Text']);
            }
        }

        if (this.regex && !this.regex.test(value)) {
            errors.push(this.regexText);
        }

        return errors;
    }
});
*/

// Костыли для Ext'а
//Ext.override(Ext.form.ComboBox, { setReadOnly: function(v) {
//    //    if (this.id == "calcAccYear") {
//    //        var t = 1;
//    //    }  

//    Ext.form.ComboBox.superclass.setReadOnly.call(this, v);
//}
//});


// Костыли для Ext'а
Ext.override(Ext.form.ComboBox,
{
    setValue: function(v, fireSelect) {

        if (fireSelect === undefined) fireSelect = true;
        var text = v;
        if (this.valueField) {
            var r = this.findRecord(this.valueField, v);
            if (r) {
                text = r.data[this.displayField];
                if (fireSelect) {
                    this.value = v;
                    this.fireEvent('select', this, r, this.store.indexOf(r));
                }
            }
            else if (Ext.isDefined(this.valueNotFoundText)) {
                text = this.valueNotFoundText;
            }
        }

        this.lastSelectionText = text;

        if (this.hiddenField) {
            this.hiddenField.value = v;
        }

        this.value = v;

        if (this.emptyText && this.el && !Ext.isEmpty(v)) {
            this.el.removeClass(this.emptyClass);
        }

        if (this.rendered) {
            this.el.dom.value = (Ext.isEmpty(text) ? '' : text);
        }

        this.validate();

        this.applyEmptyText();
        this.autoSize();

        return this;
    }
});

Ext.override(Ext.form.Checkbox,
{
    setValue: function(v, fireSelect) {

        if (v != this.checked) {
            this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
            if (this.rendered) {
                this.el.dom.checked = this.checked;
                this.el.dom.defaultChecked = this.checked;
            }
            // this.fireEvent('change', this, v, this.checked);
            this.fireEvent('check', this, this.checked);
            if (this.handler) {
                this.handler.call(this.scope || this, this, this.checked);
            }
        }

    }
});

function dateDiff(startDate, endDate) {
    return parseInt((endDate - startDate) / (24 * 3600 * 1000));
}

function getAge(birthdate) {
    if (!birthdate) return -1;
    var now = new Date();
    var age = 0;

    age = now.getFullYear() - birthdate.getFullYear();
    var m = now.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}


Virtu.Popup = function() {
    var msgCt;

    function createBox(t, s) {
        return ['<div class="msg">', '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>', '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>', '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>', '</div>'].join('');
    }
    return {
        msg: function(title, format, duration) {

            if (!msgCt) {
                msgCt = Ext.DomHelper.insertBefore(Ext.get('dMain'),
                {
                    id: 'msg-div'
                }, true);
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt,
            {
                html: createBox(title, s)
            }, true);

            m.slideIn('t',
            {
                easing: 'easeOut',
                duration: .5
            }).pause(duration).ghost("t",
            {
                remove: true
            });
        },

        init: function() {
            var t = Ext.get('exttheme');
            if (!t) { // run locally?
                return;
            }
            var theme = Cookies.get('exttheme') || 'aero';
            if (theme) {
                t.dom.value = theme;
                Ext.getBody().addClass('x-' + theme);
            }
            t.on('change', function() {
                Cookies.set('exttheme', t.getValue());
                setTimeout(function() {
                    window.location.reload();
                }, 250);
            });

            var lb = Ext.get('lib-bar');
            if (lb) {
                lb.show();
            }
        }
    };
} ();