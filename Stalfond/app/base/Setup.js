/**
 * @singleton
 * @class MyApp.base.Setup
 *
 *
 *  <p>Объект для настройки системы под особенности конкретного проекта.</p>
 *
 * Подразумевается что в случае необходимости в обработчике загрузки,
 * мы перекроем методы описанные в сетапе примерно
 * следующим образом:
 <pre><code>
     Ext.define('MyApp.base.Setup', {
        singleton : true,
        requires  : 'VLib.Setup'
     }, function(){
        Ext.override(VLib.Setup, {
            libMethod: function()
            {
                //Реализация
            }
        });
    });
 </code></pre>
 *
 * Но не стоит забывать что если описание MyApp.base.Setup
 * содержит (requires  : 'VLib.Setup') то  базовый сетап уже
 * выполнился, если данного поведения нужно избежать переностие
 * requires в обработчик загрузки.
 *
 */
Ext.define('Stalfond.base.Setup', {
    singleton : true,
    requires  : ['VLib.Setup']
}, function(){

    Ext.Date.y2kYear = 29;

});