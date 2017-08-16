// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('asaApp', ['ionic', 'angularSpinner'])
.run(function ($ionicPlatform, $rootScope, asaApp, $state) {
    $ionicPlatform.ready(function () {
        if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        //load profile values from local storage 
        $rootScope.periodList = [];
        $rootScope.submissionList = [];
        // $rootScope.paymentDetails = [];
        //$rootScope.globalObject = {};
        //doesnt exist redirect to prodile controller 
        //var state = '/menu/tab/dashboard';
        //if(asaApp.isInitialRun())
        //{
        //    asaApp.setInitialRun(false);
        //    //state = '/menu/tab/form';
        //}
        //$state.go(state);
        //if (window.cordova) {
        //    cordova.getAppVersion.getVersionNumber().then(
        //      function (version) {
        //          SessionService.persist('appVersion', version);
        //      }
        //    );
        //    cordova.getAppVersion.getVersionCode().then(
        //      function (code) {
        //          SessionService.persist('appVersionCode', code);
        //      }
        //    );
        //}
    });
    var state = "menu.senderProfile";  // whatever, the main page of your app
    //var state = "menu.tabs.dashboard"
    if ((asaApp.isInitialRun()===true) || (asaApp.isprofileComplete()===false)) {
        asaApp.setInitialRun(false);
        $state.go(state);
    }
    else
    {
        //$state.go('menu.tabs.dashboard');
        
        $state.go('menu.login');
    }
    
})
.directive('myDirective', function ($rootScope) {
    return {
        require: '?ngModel',
        scope: {
            "myDirectiveFn": "="
        },
        link: function (scope, element, attr, ngModel) {
            ngModel.$validators.myDirective = function (modelValue) {
                var input = new Date(modelValue);
                var mm = input.getMonth()+1;
                var yy = input.getFullYear();
                var str = yy + "-" + pad(mm);
                var arrStr = localStorage.getItem("periodlist");
                var arr = JSON.parse(arrStr);
                if (arr !== null && arr!==undefined)
                {
                    if (existsInArray(arr, str)) {
                        console.log("alredy exist");
                        return false;
                        
                    }
                    else {
                        console.log("not found");
                        return true;
                    }
                }
                
                function existsInArray(arr, item) {
                    for (var i = 0; i < arr.length; i++)
                    {
                        var data = arr[i];
                        if (data.periodId === item) {
                            return true; //break;
                        }
                        else{
                            continue;
                        }
                        //return false;
                    }
                }
                function pad(d) {
                    return (d < 10) ? '0' + d.toString() : d.toString();
                }
                console.log("arr is undefined or null");
                return modelValue;
                //ButtonsTabCtrl.$parsers.push(checkPeriodExists);
            }
            element.bind('change', function (e) {
                scope.myDirectiveFn(e.target.value);
            })
        }
    }
})
.directive('equals', function() {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, elem, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function() {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function (val) {
                validate();
            });

            var validate = function() {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
            };
        }
    }
})
.service('amCharts', function () {
    var methods = {
        "makeChart": function (data) {
            var chart = AmCharts.makeChart("chartdiv", {
                
                "type": "pie",
                "theme": "light",
                "dataProvider": data,
                "categoryField": "PeriodId",
                "valueField": "value",
                "titleField": "PeriodId",
                "outlineAlpha": 0.4,
                "depth3D": 15,
                "balloonText": "Total Sales Gross: [[TotalSalesGross]]<br><span style='font-size:12px'><b>Net VAT: [[value]]</b> ([[percents]]%)</span>",
                "angle": 30,
                "export": {
                    "enabled": false
                }                    
            })
            chart.Title = "Summary";
            chart.pulledField = "PeriodId";
            chart.pullOutOnlyOne = true;
            return chart;
        },
        "makeDummy": function () {
            var chart = AmCharts.makeChart("chartdiv", {
                "titles": [{
                    "text": "Example Data",
                    "size": 10,
                    "align": "center",
                }],
                //tooltip: {
                //    formatter: function() {
                //        var s;
                //        if (this.point.name) { // the pie chart
                //            return " "+ [[value]];
                //        } else {
                //            s = ''+
                //                this.x  +': '+ this.y;
                //        }
                //        return s;
                //    },
                "marginLeft": -70,
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
                    //,"pullOut": true
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
            chart.handDrawn = true;
            chart.Title = "Sample chart";
            chart.pulledField = "Quater";
            
            chart.pullOutOnlyOne = true;
            return chart;
        }
    }   
    return methods;

})
.constant('Constants', {
    Status: {
        1: 'NotSubmitted',
        2: 'Pending',
        3: 'Acknowledge',
        4: 'Accepted',
    }
})
.service('ForgotpwdService', ['$q','$http',function ($q, $http ,$rootScope) {//not used this yet may in future implementation
    return {
        RecoverUserPwd: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //return $http.post('' + email);
            var senderdetails = localStorage.getItem("senvm");
            if (senderdetails !== null && senderdetails !== undefined) {
                var temp = JSON.parse(senderdetails);
                if (temp !== null && temp !== undefined)
                {
                    var email = temp.Email;
                    var pwd = temp.password;
                }                
            }
            if (data === email) {
                //return $http.post('' + email);
                var Indata = { 'useremail': email, 'userpwd': pwd };
                //var resp = $http.post('http://localhost:52991/api/RecoverPasswordLink' + Indata);
               // $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                $http({
                    method: 'POST',
                    url: "http://asadev-api.azurewebsites.net/api/PasswordRecover", //"http://asa-api.azurewebsites.net/api/submission",
                    dataType: 'json',
                    data: Indata,
                    headers: { 'Content-Type': 'application/json' }
                    //,params: { busStr: angular.toJson($scope.businessvm, false) }
                }).success(function (resp) {
                    deferred.resolve(resp);
                }).error(function (resp) {
                    deferred.reject('Not registerd email address.');
                });
                
            } else {
                deferred.reject('Not registerd email address.');
            }
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
}])
.service('LoginService', function ($q, $rootScope) {//not used this yet may in future implementation
    return {
        loginUser: function (name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var senderdetails = localStorage.getItem("senvm");
            if (senderdetails !== null && senderdetails !== undefined)
            {
                var temp = JSON.parse(senderdetails);
                var email = temp.Email;
                var pwd = temp.password;
            }
            if (name === email && pw === pwd) {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
   }
})
.service('testService', function () {
    this.sayHello = function (text) {
        return "Services say \"Hello " + text + "\"";
    };
})
.service('busprofileServiceManager', function () {
    //this.getbusdetails = function () {
    //    return $http({
    //        method: 'Get',
    //        url: "http://localhost:55934/api/business"
    //    });
    //};
    //var id = 0;
    //var Details = [];
    //this.save = function (text) {
    // if (businessInfo.id == null) {
    //   businessInfo.id = id++;
    //return "service layer" + text;

    //addNewBusiness()  
    //businessDetails.push(text);
    //} else {
    //  for (i in businessDetails) {
    //    if(businessDetails[i].id==busines.id)
    //  {
    //    businessDetails[i] = businessInfo;
    //}
    //}
    //}
    // }
})
.service('payVMService',['submissionService','payvm', function (submissionService, payvm) {
    var methods = {
        "get":function(pkey){
            var result = null;
            var pinfo = submissionService.getValue(pkey);
            if (pinfo !== null && pinfo !== undefined) {
                if (parseFloat(pinfo.PaymentNotification.NetVAT) > 0)
                {
                    //payvm.InformationNotification = pinfo.PaymentNotification.DirectDebitPaymentStatus.CollectionDate;
                    payvm.PaymentDueDate = pinfo.PaymentDueDate;
                    payvm.PaymentNotification = pinfo.PaymentNotification.NetVAT;
                    payvm.ReceiptTimestamp = pinfo.ReceiptTimestamp;
                    payvm.VATDeclarationReference = pinfo.VATDeclarationReference;
                    payvm.TotalSalesGross = pinfo.TotalSalesGross;
                    payvm.IRMark = pinfo.IRMark;
                }
                else
                {
                    payvm.InformationNotification = pinfo.InformationNotification.Narrative;
                    payvm.PaymentDueDate = pinfo.PaymentDueDate;
                    payvm.PaymentNotification = pinfo.PaymentNotification.NetVAT;
                    payvm.ReceiptTimestamp = pinfo.ReceiptTimestamp;
                    payvm.VATDeclarationReference = pinfo.VATDeclarationReference;
                    payvm.TotalSalesGross = pinfo.TotalSalesGross;
                    payvm.IRMark = pinfo.IRMark;
                }
                
            }
            return payvm;
        }
        
    }
    return methods;
}])
.service('payvm', function () {
    return payvm = {
        "InformationNotification": "",
        "PaymentDueDate": "",
        "PaymentNotification": "",
        "ReceiptTimestamp": "",
        "VATDeclarationReference": "",
        "TotalSalesGross": "",
        "IRMark":""
    };
})
//todo: the below approach hasn't worked still has cache problem so reverting back to previos methods reading direct from local storage 
    //future refactoration reguired
 //.service('senvm', function () {
 //    var svm = {
 //        "Title": "",
 //        "ForName1": "",
 //        "ForName2": "",
 //        "SurName": "",
 //        "Telephone": "",
 //        "Mobile": "",
 //        "Email": "",
 //        "Password": "",
 //        "SenderId": "",
 //        "SenderPassword": ""
 //    };
 //    //var senvm = localStorage.getItem("senvm");
 //    //if (senvm !== null && senvm !== "undefined") {
 //    //    //var temp = JSON.parse(senvm); //parse and fill model with object 
 //    //    svm = JSON.parse(senvm);
 //    //    //console.log("tempdata" + temp);
 //    //    //svm = temp;
 //    //}
 //    return svm; //return model
 //})
 //   .service('busvm', function () {
 //       var busvm = {
 //           "BusinessName": "",
 //           "TradingName": "",
 //           "RegisteredDate": "",
 //           "VATRegNo": ""
 //       };
        
 //       return busvm;
 //   })
 //   .service('addvm', function () {
 //       var addvm = {
 //           "Line1": "",
 //           "Line2": "",
 //           "Line3": "",
 //           "Line4": "",
 //           "PostCode": "",
 //           "Country": ""
 //       };
 //               return addvm;

 //   })
 //   .service('pervm', function () {
 //       var pervm = {
 //           "StartPeriod": "",
 //           "EndPeriod": "",
 //           "PeriodId":""
 //       };
 //       //var periodvm = $localstorage.getObject("pervm");
 //       //if (periodvm !== null && periodvm !== "undefined") {
 //         //  pervm = periodvm;//JSON.parse(periodvm);
 //       //}
 //       return pervm;
 //   })
.service('submissionService', ['factoryManagerService', function (factoryManagerService) {
    //var submissions = [];
    //var subStr = localStorage.getItem("submissionslist");
    //subLst = JSON.parse(subStr);
    //if(subLst!==null && subLst!== undefined)
    //{
    //    submissions = subLst;
    //}
    var methods = {
        "get": function (pkey) {
            var result = null;
            var submissions = factoryManagerService.getSubmissionData();
            angular.forEach(submissions, function (v) {
                if (v.id === pkey) result = v;
            });
            return result;
        },
        "getValue": function (pkey) {
            var result = methods.get(pkey);
            return (result !== null) ? result.value : null;
        }
    }
    return methods;


}])
.service('factoryManagerService', ['localFactory', function (localFactory) {
        var methods = {
            "getObject": function (pkey) {
                var result = null;
                result = localFactory.getObject(pkey);
                if (result !== null) {
                    return pervm = result;
                }
            },
            "setObject":function(pkey, data){
                localFactory.setObject(pkey, data);
            },
            "get": function (pkey) {
                return localFactory.get(pkey);
            },
            "set": function (pkey, value) {
                localFactory.set(pkey, value);
            },
            "getSubmissionData": function () {
                var submissions = [];
                submissions = localFactory.getObject("submissionlist");
                //var payitems = [];
                //var subLst = localFactory.getObject("submissionlist");
                
                //if (subLst !== null && subLst !== undefined) {
                //    // submissions = subLst; //if its array of ojects just set or else read each and push to submisisons array
                //   // for (var i = 0; i < subLst.length; i++) {
                //     //   var paymentData = subLst[i];
                //        //payitems.push(paymentData);
                //        submissions.push(paymentData);
                //    ///}
                //}
                return submissions;
            }

        }
        return methods;
    }])
    
.factory('localFactory', ['$window','$http', function ($window,$http) {
    return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
 }])
//.factory('periodsManager', ['$http', '$q', 'Period', function ($http, $q, Period) {
//    var periodsManager = {
//        _pool: {},
//        _retrieveInstance: function (periodId, periodData) {
//            var instance = this._pool[periodId];
//            if (instance) {
//                instance.setData(periodData);
//            } else {
//                instance = new Period(periodData);
//                this._pool[periodId] = instance;
//            }
//            return instance;
//        },
//        _search: function (periodId) {
//            return this._pool[periodId];
//        },
//        _load: function (periodId, deferred) {
//            var scope = this;
//            var periodData = localStorage.getItem("pervm");
//            if (periodData) {
//                var period = scope._retrieveInstance(periodData.periodId, periodData);
//                deferred.resolve(period);
//            }
//            else {
//                deferred.reject();
//            }

//        },
//        /* public methods*/
//        getPeriod: function (periodId) {
//            var deferred = $q.defer();
//            var period = this._search(periodId);
//            if (period) {
//                deferred.resolve(period);
//            } else {
//                this._load(periodId, deferred);
//            }
//            return deferred.promise;
//        },
//        setPeriod: function (periodData) {
//            var scope = this;
//            var period = this._search(periodData.periodId);
//            if (period) {
//                period.setData(periodData);
//            } else {
//                period = scope._retriveInstance(periodData);
//            }
//            return period;
//        },
//    };
//    return periodsManager;
//}])
//.factory('submissionFactory', function () {
//        var submissions = [];
//        var payitems = [];
//        var subStr = localStorage.getItem("submissionlist");
//        subLst = JSON.parse(subStr);
//        if (subLst !== null && subLst !== undefined) {
//            // submissions = subLst; //if its array of ojects just set or else read each and push to submisisons array
//            for (var i = 0; i < subLst.length; i++) {
//                var paymentData = subLst[i];
//                //payitems.push(paymentData);
//                submissions.push(paymentData);
//            }
//            //for (j = 0; j < payitems.length; j++) {
//            //    var temp = payitems[j];
//            //    submissions.push(temp['Body']);
//            //}
//            //angular.forEach(subLst, function (item) {
//            //    paymentInfo = item
//            //    submissions.push(paymentInfo);
//            //});
//        }
//        return {
//            getSubmissionData: function () {
//                return submissions;
//            }
//        }

//    })
//.factory('$localstorage', ['$window', function ($window) {
//    return {
//        set: function (key, value) {
//            $window.localStorage[key] = value;
//        },
//        get: function (key, defaultValue) {
//            return $window.localStorage[key] || defaultValue;
//        },
//        setObject: function (key, value) {
//            $window.localStorage[key] = JSON.stringify(value);
//        },
//        getObject: function (key) {
//            return JSON.parse($window.localStorage[key] || '{}');
//        }
//    }
//}])
.factory('utilsFactory', function () {
    //function definition
    var isLeapYear = function isLeapYear(year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    
    };
    //function definition
    var getDaysInMonth = function getDaysInMonth(year, month) {
        return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };
    var addMonths = function addMonths(date, value) {
        var d = new Date(date),
            n = d.getDate();
        d.setDate(1);
        d.setMonth(d.getMonth() + value);
        d.setDate(Math.min(n, getDaysInMonth(d.getFullYear(), d.getMonth())));
        return d;
    };
    //return functions after the injection
    return {
        addMonths: addMonths
        
    };
})
.factory('asaApp', function ($window) {
    return {
        setInitialRun: function (initial) {
            $window.localStorage["initialRun"] = (initial ? "true" : "false");
        },
        isInitialRun: function () {
            var value = $window.localStorage["initialRun"] || "true";
            return value === "true";
        },
        isprofileComplete: function () {
            var pv = $window.localStorage["senvm"];
            if (pv !== null && pv !== undefined) {
                return true;
            }
            else {
                return false;
            }
        },
        istrailPeriodExpired: function () {
            var sub = $window.localStorage["submissionlist"];
            var send = $window.localStorage["senvm"];

            if (sub !== null && sub !== undefined) {
                var subArr = JSON.parse(sub);
                if (send !== null && send !== undefined) {
                    var senT = JSON.parse(send);
                }
                if (subArr !== null && subArr !== undefined) {
                    var count = subArr.length;
                    if (senT !== null && senT !== undefined)
                    {
                        var em = senT.Email;
                    }
                    if (em === "asavattest@gmail.com" || em === "asasoftwaresolutions@outlook.com") //bypass version check for testing 
                    {
                        return false;
                    }
                    else {
                        if (count >= 2) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }                  

                }
            }
            return false;
        }
    };
 })
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider
    //.state('dashboard', {
    //    url:'menu/dashboard',
    //    templateUrl: 'templates/dashboard.html',
    //    controller: 'DashboardController'
    //})
    .state('menu', {
        url: "/menu",
        abstract: true,
        templateUrl: "menu.html",
        controller: 'MenuCtrl'
    })
    .state('menu.tabs', {
        url: "/tab",
        views: {
            'menuContent': {
                templateUrl: "tabs.html"
            }
        }
    })
     .state('menu.tabs.dashboard', {
         cache: false,
         url: "/dashboard",
         views: {
             'dashboard-tab': {
                 templateUrl: "dashboard.html",
                 controller: 'DashboardController'
             }
         }
     })
        .state('menu.tabs.returns', {
            cache: false,
            url: "/returns",
            views: {
                'returns-tab': {
                    templateUrl: "returns.html",
                    controller: 'ReturnsTabCtrl'
                }
            }


        })
        .state('menu.tabs.subitem', {
            url: "/subitem",
            // params:{
            //   periodId: null
            //},
            views: {
                'dashboard-tab': {
                    templateUrl: "subitem.html",
                    controller: 'subCtrl'//function ($scope, $stateParams) {
                    //    $scope.periodId = $stateParams.periodId;
                    //}
                }
            }
        })
     //.state('menu.tabs.list', {
     //    url: "/list",
     //    views: {
     //        'list-tab': {
     //            templateUrl: "list.html",
     //            controller: 'ListCtrl'
     //        }
     //    }
     //})
    .state('menu.tabs.item', {
        url: "/item",
        views: {
            'list-tab': {
                templateUrl: "item.html"
            }
        }
    })
    .state('menu.tabs.form', {
        url: "/form",
        views: {
            'form-tab': {
                templateUrl: "form.html",
                controller: 'busCtrl'
            }
        }
    })
      .state('menu.about', {
          url: "/about",
          views: {
              'menuContent': {
                  templateUrl: "about.html",
                  controller: 'aboutCtrl'
              }
          }
      })
    .state('menu.senderProfile', {
        url: "/senderprofile",
        views: {
            'menuContent': {
                templateUrl: "sender.html",
                controller: 'senCtrl'
            }
        }
    })
         //.state('menu.login-into-menucontent', {
         //    url: "/login-into-menucontent",
         //    views: {
         //        'menuContent': {
         //            templateUrl: "login.html",
         //            controller: 'LoginCtrl'
         //        }
         //    }
         //})
          .state('menu.forgotpwd', {
              url: '/forgotpwd',
              views: {
                  'menuContent': {
                      templateUrl: 'forgotpwd.html',
                      controller: 'ForgotpwdCtrl'
                  }
              }

          })
         .state('menu.sendfeedback', {
             url: '/sendfeedback',
             views: {
                 'menuContent': {
                     templateUrl: 'sendfeedback.html',
                     controller: 'sendFeedbackCtrl'
                 }
             }

         })
        .state('menu.login', {
        url: '/login',
        views:{
            'menuContent':{
                templateUrl: 'login.html',
                controller: 'LoginCtrl'
            }
        }
        
    });
   // $urlRouterProvider.otherwise('/menu/tab/dashboard');
   $urlRouterProvider.otherwise('menu.login');


});
