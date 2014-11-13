// Сторы
var yesnoStore = [[false, 'Нет'], [true, 'Да']];
//var rateStore = [['0', 'Единовременно'], ['1', 'Ежегодно'], ['2', 'Раз в полгода'], ['4', 'Ежеквартально'], ['12', 'Ежемесячно']];
var rateStore = [['0', 'Единовременно', '30000', ''], ['1', 'Ежегодно', '10000', ''], ['2', 'Раз в полгода', '6000', ''], ['4', 'Ежеквартально', '3000', ''], ['12', 'Ежемесячно', '1500', '']];
var sexStore = [['1', 'Мужской'], ['2', 'Женский']];
var countryStore = [['1', 'РФ'], ['2', 'Иное']];
var invalidStore1 = [['1', 'I Группа']];
var invalidStore2 = [['1', 'I Группа'], ['2', 'II Группа']];
var invalidStore3 = [['1', 'I Группа'], ['2', 'II Группа'], ['3', 'III Группа']];
var documentStore = [['1', 'Паспорт гражданина РФ'], ['2', 'Иное']];
var documentStore2 = [['1', 'Паспорт гражданина РФ'], ['2', 'Иное']];
var visaStore = [['1', 'Паспорт гражданина РФ'], ['2', 'Иное']];
var evidenceStore = [['0', 'Нет'], ['1', 'Да, указано в договоре'], ['2', 'Да, указано в доверенности'], ['3', 'Да, указано в заявлении'], ['4', 'Да, указано в ином документе']];
var benTypeStore = [['1', 'Физическое лицо']]; //  ['2', 'Юридическое лицо'] ништяк прикол
var durationStore = [[]];
var accStore = [[]];
var fundStore = [[]];
var payoutStore = [[]];
var profStore = [[]];
var incomeStore = [['1', 'Гарантированный доход'], ['2', 'Участие в Инвестиционном доходе']];
// Константы
var currencyName = "RUR";
var currencyCODE = "";
// максимальный возраст застрахованного ребенка
var maxChildAgeForInsurance = 24;
var maxAgeDateInsurer = new Date().format((new Date().getFullYear() - 18) + '-m-d'); ;
// Профильные значения
var uwRecipient;
var maxBen;
var minSum;
var maxSum;
var minAge;
var maxAge;
var minDuration;
var maxDuration;
var minAgeDate;
var maxAgeDate;
var minAgeChildDate;
var maxAgeChildDate;
var scanner;
var uploadTool;
var calcCurrencyAllow;
var riskAccidentDeath;
var riskInjuries;
var riskAccidentHospital;
var riskSOSZHV;
var riskInvalid1;
var riskInvalid2;
var riskInvalid3;

//var SalesPointBroker;
//var SalesPointCurator;
//var SalesPointCreditOrganization;
//var SalesPointSalesChannel;
//var SalesPointSpecials;
//var SalesPointSalesPoint;
//var SalesPointAuthor;
