///depricated file not used as this is injected as service in app.js

var strdata = localStorage.getItem("submissionlist");
var data = JSON.parse(strdata);
var pvm = {
    "PeriodId": "",
    "NetVAT":0
};
var pvmd = {
    "Quater": "Q1",
    "value": parseInt(10)
};
var pvmArrD = [];
var pvmArr = [];
pvmArrD.push(pvmd);
if (data != null && data!= undefined) {
    for (var i = 0; i < data.length; i++) {
        pvm.PeriodId = data[i].id;
        pvm.NetVAT = parseInt(data[i].value.PaymentNotification.NetVAT);
        pvmArr.push(pvm);
    }
}
if ((pvmArr !== undefined) && (pvmArr.length >= 0)) {
    console.log(pvmArrD);
    var chart = AmCharts.makeChart("chartdiv", {
        "type": "pie",
        "theme": "light",
        "dataProvider": pvmArrD
    //        [{
    //        "Quater": "1950",
    //    "value": 0.307
    //}, {
    //    "Quater": "1951",
    //    "value": 0.168
    //}, {
    //    "Quater": "1952",
    //    "value": 0.073
    //}]
        ,
       // "categoryField": "Quater",
        "valueField": "value",
        "titleField": "Quater",
        "outlineAlpha": 0.4,
        "depth3D": 15,
        "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
        "angle": 30,
        "export": {
            "enabled": false
        }
    });  
}
else
{
    var chart = AmCharts.makeChart("chartdiv", {
        "type": "pie",
        "theme": "light",
        "dataProvider": [{
            "Quater": "Quater1",
            "value": 260
       
        }, {
            "Quater": "Quater2",
            "value": 201
        }, {
            "Quater": "Quater3",
            "value": 65
        }, {
            "Quater": "Quater4",
            "value": 39
        }],
        "valueField": "value",
        "titleField": "Quater",
        "outlineAlpha": 0.4,
        "depth3D": 15,
        "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
        "angle": 30,
        "export": {
            "enabled": false
        }
    });
    
    
}