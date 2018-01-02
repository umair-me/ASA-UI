// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('asaApp', ['ionic', 'angularSpinner', 'ti-segmented-control', 'angularUUID2'])
    .run(function ($ionicPlatform, $rootScope, asaApp, $state, $ionicPopup) {
        $rootScope.periodList = [];
        $rootScope.submissionList = [];
        $rootScope.invItemsList = [];
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

            if (window.cordova) {
                cordova.getAppVersion.getVersionNumber(function (version) {
                    console.log("appversion:" + version);
                    $rootScope.appversion = version;
                    //TODO: future implementation to force users to update 
                    //var curversion = localStorage.getItem("appversion");
                    //if (curversion !== null || curversion !== undefined) {
                    //    //compare versions 
                    //    var appminorbuildno = parseInt(curversion.substring(2, 4));
                    //    var storebuildno = parseInt(version.substring(2, 4));
                    //    if (storebuildno >= appminorbuildno)
                    //    {
                    //        //display ionic pop up to update 
                    //        //  native.showPopup("appStore");
                    //        $ionicPopup.alert({
                    //            title: 'Update Required',
                    //            content: 'New version of app is avaible, update from now.',
                    //            buttons: [{ text: 'OK' }]
                    //        }).then(function (res) {

                    //        });

                    //    }
                    //}
                    //else {
                    //    localStorage.setItem("appversion", JSON.stringify(version));
                    //}
                });
            }

        });
        var state = "menu.senderProfile";  // whatever, the main page of your app
        //var state = "menu.tabs.dashboard"
        if ((asaApp.isInitialRun() === true) || (asaApp.isprofileComplete() === false)) {
            asaApp.setInitialRun(false);
            $state.go(state);
        }
        else {
            $state.go('menu.tabs.dashboard');        
            //$state.go('menu.login');
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
                    var mm = input.getMonth() + 1;
                    var yy = input.getFullYear();
                    var str = yy + "-" + pad(mm);
                    var arrStr = localStorage.getItem("periodlist");
                    var arr = JSON.parse(arrStr);
                    if (arr !== null && arr !== undefined) {
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
                        for (var i = 0; i < arr.length; i++) {
                            var data = arr[i];
                            if (data.periodId === item) {
                                return true; //break;
                            }
                            else {
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
    .directive('equals', function () {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, elem, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // watch own value and re-validate on change
                scope.$watch(attrs.ngModel, function () {
                    validate();
                });

                // observe the other value and re-validate on change
                attrs.$observe('equals', function (val) {
                    validate();
                });

                var validate = function () {
                    // values
                    var val1 = ngModel.$viewValue;
                    var val2 = attrs.equals;

                    // set validity
                    ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
                };
            }
        }
    })
    .service('amCharts', function () {
        var methods = {
            "makeChart": function (data) {
                var chart = AmCharts.makeChart("chartdiv", {
                    "titles": [{
                        "text": "Current Financial Year Returns",
                        "size": 10,
                        "align": "center",
                    }],
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
        },
        VATRate: {
            1: '0.00',
            2: '20.00'
        }
    })
    .constant('config', {
        //appName: 'My App',
        //appVersion: 2.0,
        apiUrl: 'http://localhost:52991/api'//'http://asadev-api.azurewebsites.net/api' 
    })
    //.constant('BUILD', {
    //    VERSION: "%%VERSION%%" // %%VERSION%% will be replaced with the actual version from config.xml
    //})
    .service('ForgotpwdService', ['$q', 'config', '$http', function ($q, config, $http, $rootScope) {//not used this yet may in future implementation
        return {
            RecoverUserPwd: function (data) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //return $http.post('' + email);
                var senderdetails = localStorage.getItem("senvm");
                if (senderdetails !== null && senderdetails !== undefined) {
                    var temp = JSON.parse(senderdetails);
                    if (temp !== null && temp !== undefined) {
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
                        url: config.apiUrl + "/PasswordRecover", //"http://asa-api.azurewebsites.net/api/submission",
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
    .service('LoginService', function ($q, $rootScope) {
        return {
            loginUser: function (name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var senderdetails = localStorage.getItem("senvm");
                if (senderdetails !== null && senderdetails !== undefined) {
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
    .service('payVMService', ['submissionService', 'payvm', function (submissionService, payvm) {
        var methods = {
            "get": function (pkey) {
                var result = null;
                var pinfo = submissionService.getValue(pkey);
                if (pinfo !== null && pinfo !== undefined) {
                    if (parseFloat(pinfo.PaymentNotification.NetVAT) > 0) {
                        //payvm.InformationNotification = pinfo.PaymentNotification.DirectDebitPaymentStatus.CollectionDate;
                        payvm.PaymentDueDate = pinfo.PaymentDueDate;
                        payvm.PaymentNotification = pinfo.PaymentNotification.NetVAT;
                        payvm.ReceiptTimestamp = pinfo.ReceiptTimestamp;
                        payvm.VATDeclarationReference = pinfo.VATDeclarationReference;
                        payvm.TotalSalesGross = pinfo.TotalSalesGross;
                        payvm.IRMark = pinfo.IRMark;
                    }
                    else {
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
            "IRMark": ""
        };
    })
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
            "setObject": function (pkey, data) {
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
            },
            "getInvItemsData": function () {
                var invItems = [];
                invItems = localFactory.getObject("invitemlist");
                return invItems;
            }

        }
        return methods;
    }])
    .factory('clientFactory', ['config', '$http', '$rootScope', function (config, $http, $rootScope) {

        var urlBase = config.apiUrl + '/client';
        var clientFactory = {};

        clientFactory.getClients = function () {
            return $http.get(urlBase);
        };

        clientFactory.getClient = function (id) {
            return $http.get(urlBase + '/' + id);
        };

        clientFactory.insertClient = function (cl) {
            return $http.post(urlBase, cl);
        };

        clientFactory.updateClient = function (cl) {
            return $http.put(urlBase + '/' + cl.Id, cl)
        };

        clientFactory.deleteClient = function (id) {
            return $http.delete(urlBase + '/' + id);
        };
        clientFactory.client = '';
        clientFactory.prepForBoradcast = function (client) {
            this.client = client;
            this.broadcastItem();
        };
        clientFactory.broadcastItem = function () {
            $rootScope.$broadcast('handleBroadcast'); //not used as its not working via broadcast 
        };

        return clientFactory;
    }])
    .service('clientAddVM', function () {
        return clientAddVM = {
            "Line1": "",
            "Line2": "",
            //"Line3": "",
           // "Line4": "",
            "City": "",
            "PostCode": "",
            "Country": ""
        };

    })
    .service('clientVM', ['clientAddVM', function (clientAddVM) {
        return clientVM = {
            "Id": "",
            "Name": "",
            "RegNo": "",
            "VATNo": "",
            Address: clientAddVM
        };

    }])
    .service('invoicedetailVM', function () {
        return invdetailvm = {
            "No": "0001",
            "IssueDate": "",
            "DueDate": "",
            "Ref": "",
            "OrderNumber": "",
            "Discount": "",
            "Note":""
        };
    })
    .service('itemVM', function () {
        return itemVM = {
            "Id": "",
            "Description":"",
            "Qty": 1,
            "Price": "",
           // "ItemCode": "",
            "VATRate": "",
            "VAT":"",
            "Total": ""
        }
    })
    .service('invoiceService', ['$q', 'invoicedetailVM', 'itemVM', 'factoryManagerService', '$rootScope', function ($q, invoicedetailVM, itemVM, factoryManagerService, $rootScope) {
        var invDetails = {};
        var itemDetails = {};
        var methods = {
            "SaveInvItem": function (item) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //var itemLst = [];
                var itemLst = factoryManagerService.get("invitemlist");                

                if (item !== null && item !== undefined) {
                    //parse item to itemVM
                    itemVM.Id = item.Id;
                    itemVM.Description = item.Description;
                    itemVM.Qty = item.Qty;
                    itemVM.Price = item.Price;
                    itemVM.VAT = item.VAT;
                    itemVM.VATRate = item.VATRate;
                    item.Total = item.Total;
                    if (itemLst !== null && itemLst !== undefined) {
                        //alredy exist
                        var temp = JSON.parse(itemLst);
                        if (temp !== null && temp !== undefined) {
                            temp.push({ id: itemVM.Id, value: itemVM });
                            factoryManagerService.set("invitemlist", JSON.stringify(temp));

                        }
                    }
                    else {
                        $rootScope.invItemsList.push({ id: itemVM.Id, value: itemVM });
                        factoryManagerService.set("invitemlist", JSON.stringify($rootScope.invItemsList));
                    }
                    //itemLst.push({ id: itemVM.Id, value: itemVM }); //TODO: id should be unique to item add uuid library to generate 
                    //factoryManagerService.set("invitemlist", JSON.stringify(itemLst));
                    deferred.resolve('sucessfully added');                                      
                }
                else {
                    deferred.reject("Item null or undefined");
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
            },
            "UpdateInvItem": function (updtitem) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                if (updtitem !== null && updtitem !== undefined) {
                    //get list from local storage                      
                    var invItemsLst = factoryManagerService.getInvItemsData();
                   angular.forEach(invItemsLst, function (v) {
                        if (v.value.Id === updtitem.Id) {
                            v.value.Description = updtitem.Description;
                            v.value.Qty = updtitem.Qty;
                            v.value.Price = updtitem.Price;
                            v.value.VAT = updtitem.VAT;
                            v.value.VATRate = updtitem.VATRate;
                            v.value.Total = updtitem.Total;
                            factoryManagerService.set("invitemlist", JSON.stringify(invItemsLst));
                            deferred.resolve('sucessfully updated');
                            return true;
                        }                       
                   });                   
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
            },
            "getInvItemById": function (Id) {
                //var itemVM = {};
                if (Id !== null && Id !== undefined)
                {
                    //itemVM = null;
                    var myItems = factoryManagerService.getInvItemsData();
                    angular.forEach(myItems, function (v) {
                        if (v.value.Id === Id)
                        {
                            itemVM.Id = v.value.Id;
                            itemVM.Description = v.value.Description;
                            itemVM.Qty = v.value.Qty;
                            itemVM.Price = v.value.Price;
                            itemVM.VAT = v.value.VAT;
                            itemVM.VATRate = v.value.VATRate;
                            itemVM.Total = v.value.Total;
                            return itemVM;                            
                        }
                        else
                        {
                            return null;
                        }
                        
                    });                    
                }
                return itemVM;
                
            },
            "DeleteInvItem": function (Id) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                if (Id !== null && Id !== undefined) {
                    //get list from local storage                      
                    var invItemsLst = factoryManagerService.getInvItemsData();
                    angular.forEach(invItemsLst, function (v) {
                        if (v.value.Id === Id) {
                            var index = invItemsLst.indexOf(v);
                            invItemsLst.splice(index, 1);
                            factoryManagerService.set("invitemlist", JSON.stringify(invItemsLst));
                            deferred.resolve('sucessfully deleted');
                            return true;
                        }
                    });
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
            },
            "setInVM": function (invm) {
                if (invm !== null && invm !== undefined) {
                    invDetails = invm;
                    return invm;
                }
            },
            "getInVM": function () {
                if (invDetails.IssueDate !== null && invDetails.IssueDate !== undefined) {
                    invoicedetailVM.IssueDate = invDetails.IssueDate;
                    invoicedetailVM.DueDate = invDetails.DueDate;
                    invoicedetailVM.Ref = invDetails.Ref;
                    invoicedetailVM.OrderNumber = invDetails.OrderNumber;
                    invoicedetailVM.Discount = invDetails.Discount;
                    invoicedetailVM.Note = invDetails.Note;
                    return invoicedetailVM;
                }
                return invoicedetailVM; //empty model 
            },
            "setItemVM": function (itemvm) {
                if (itemvm !== null && itemvm !== undefined)
                {
                    itemDetails = itemvm;
                    return itemDetails;
                }
            },
            "getItemVM": function () {
                if (itemDetails !== null && itemDetails.Price !== undefined)
                {
                    itemVM.Description = itemDetails.Description;
                    itemVM.Qty = itemDetails.Qty;
                    itemVM.Price = parseInt(itemDetails.Price);
                    itemVM.VAT = parseInt(itemDetails.VAT);
                    itemVM.Total = parseInt(itemDetails.Total);
                    return itemVM;
                }
                return itemVM; 
            }       
        };
        return methods;
    }])
    .service('clientService', ['clientFactory', 'clientAddVM', 'clientVM', function (clientFactory, clientAddVM, clientVM) {
        var methods = {
            "getClientById": function (clientId) {
                clientFactory.getClient(clientId).then(function (response) {
                    if (response !== null && response !== undefined) {
                        clientVM.Id = response.data.Id;
                        clientVM.Name = response.data.Name;
                        clientVM.RegNo = response.data.RegNo;
                        clientVM.VATNo = response.data.VATNo;
                        clientVM.Address = response.data.Address;
                       
                    }
                }, function (erorr) {
                    console.log(erorr.message);
                });
                return clientVM;
            }
            //,
            //"updateClientById": function (client) {
            //    clientFactory.updateClient(client).then(function (response) { }, function (error) { })
            //}
        };
        return methods;
        }        
    ])
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
                    if (em.toLowerCase() === "asavattest@gmail.com" || em.toLowerCase() === "asasoftwaresolutions@outlook.com") //bypass version check for testing 
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
        },
        getversionInfo: function () {
            var curversion = $window.localStorage["appversion"];
            return curversion;
        }
    };
 })
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider
        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "menu.html"//,
            //controller: 'MenuCtrl'
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
        // cache: false,
         url: "/dashboard",
         views: {
             'dashboard-tab': {
                 templateUrl: "dashboard.html",
                 controller: 'DashboardController'
             }
         }
        })
        .state('menu.tabs.invoice', {
            url: "/invoice",
            views: {
                'invoice-tab': {
                    templateUrl: "invoice.html",
                    controller: 'invoiceCtrl'
                }
            }

        })
        .state('menu.tabs.createinvoice', {
            url: "/createinvoice",
            views: {
                'invoice-tab': {
                    templateUrl: "createinvoice.html",
                    controller: 'createInvoiceCtrl'
                }
            }
        })
        .state('menu.tabs.lkpclient', {
            url: "/lkpclient",
            views: {
                'invoice-tab': {
                    templateUrl: "lkpclient.html",
                    controller: 'lkpClientCtrl'
                }
            }
        })
        .state('menu.tabs.lkpclientlst', {
            url: "/lkpclientlst",
            views: {
                'invoice-tab': {
                    templateUrl: "lkpclientlst.html",
                    controller: 'lkpClientlstCtrl'
                }
            }
        })
        .state('menu.tabs.invoicedetail', {
            url: "/invoicedetail",
            views: {
                'invoice-tab': {
                    templateUrl: "invoicedetail.html",
                    controller: 'invoiceDetailCtrl'
                }
            }
        })
        .state('menu.tabs.invoiceitem', {
            url: "/invoiceitem",
            views: {
                'invoice-tab': {
                    templateUrl: "invoiceitem.html",
                    controller: 'invoiceitemCtrl'
                }
            }
        })
        .state('menu.tabs.invoiceitemupdt', {
            url: "/invoiceitemupdt",
            views: {
                'invoice-tab': {
                    templateUrl: "invoiceitemupdt.html",
                    controller: 'invoiceitemupdtCtrl'
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
        cache: false,
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
   .state('menu.caliculatevat', {
       url: "/caliculatevat",
            views: {
                'menuContent': {
                    templateUrl: "caliculatevat.html",
                    controller: 'caliculatevatCtrl'
                }
            }
        })
   .state('menu.clients', {
            url: "/clients",
            views: {
                'menuContent': {
                    templateUrl: "clients.html",
                    controller:'clientsCtrl'
                }
            }
        })
   .state('menu.clientdetail', {
       url: "/clientdetail",
       views: {
              'menuContent': {
               templateUrl: "clientdetail.html",
               controller: 'clientDetailCtrl'
              }
            }
        })
        .state('menu.addclient', {
            url: "/addclient",
            views: {
                'menuContent': {
                    templateUrl: "addclient.html",
                    controller: 'addClientCtrl'
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
   .state('menu.version', {
             url: "/version",
             views: {
                 'menuContent': {
                     templateUrl: "version.html",
                     controller: 'versionCtrl'
                 }
             }
         })
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
