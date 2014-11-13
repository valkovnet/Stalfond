/**
 * @class MyApp.base.Env
 *
 * Объект переопределяющий стандартный класс для работы с окружением.
 * Данный файл должен присутсовать во всех проектах,
 * и он обязан загружать класс: VLib.Env
 */
Ext.define('Stalfond.base.Env', {
    requires  : ['Stalfond.base.Setup', 'VLib.Env']
}, function(){
    Ext.override(VLib.Env, {

        getRisksOn: function() {
            var m = VLib.Handlers.policyModel, prod = m.get('ProductChoice'), prog = m.get('InsuranceProgram'), result = {},
                risks = initialData.tarifList.Risks;

            for (var i = 0; i < risks.length; i++) {
                var row = risks[i];
                if (row[0] == prod && row[1] == prog) {
                    result[row[2]] = 'on';
                }
            }

            return result;
        }

    });
});
