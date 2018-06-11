// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('asaApp', ['ionic', 'angularSpinner', 'ti-segmented-control', 'angularUUID2', 'pdf', 'ui.router'])
    .run(function ($ionicPlatform, $rootScope, asaApp, $state, $ionicPopup) {
        $rootScope.periodList = [];
        $rootScope.submissionList = [];
        //$rootScope.invItemsList = [];
        //$rootScope.invDetailList = [];
        $rootScope.invoiceList = [];
        $rootScope.prvInvOrderId = "";
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
            // asaApp.loadclientlistCache();
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

                    var arrStr = localStorage.getItem("periodlist");  // TODO://should get submitted list from DB for this business and check if already submitted 
                    var arr = JSON.parse(arrStr);
                    if (arr !== null && arr !== undefined) {
                        if (existsInArray(arr, str)) {
                            console.log("alredy exist");
                            return false;
                        }
                        else {
                            console.log("not found or not accepted");
                            return true;
                        }
                    }
                    function existsInArray(arr, item) {
                        for (var i = 0; i < arr.length; i++) {
                            var data = arr[i];
                            if (data.PeriodRefId === item) {                                
                                if (data.Status === 4) {
                                    return true; //break;
                                }                               
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
                    //"titles": [{
                    //    //"text": "Total Gross",
                    //    "size": 10,
                    //    "align": "center",
                    //}],
                    "type": "pie",
                    "theme": "light",
                    "dataProvider": data,
                    "categoryField": "PeriodId",
                    "valueField": "value",
                    "titleField": "PeriodId",
                    "outlineAlpha": 0.4,
                    "depth3D": 15,
                    "balloonText": "Total Gross: [[TotalGross]]<br><span style='font-size:12px'><b>Net VAT: [[value]]</b></span>",
                    "angle": 42,
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
    //.filter('stringConcat', function () {   //NOT USED may be useful to filter data in view 
    //    return function (input, delimiter) {
    //        if (input) {
    //            return input.join(delimiter)
    //        }
    //        else {
    //            return '';
    //        }
    //    };
    //})
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
    .factory('clientFactory', ['config', '$http', 'factoryManagerService', 'clientVM', function (config, $http, factoryManagerService, clientVM) {
        var urlBase = config.apiUrl + '/client';
        var clientFactory = {};
        var selectedClient = {};
        clientFactory.clientlist = [];
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
        //list = function () {
        //    if (clientFactory.clientlist.length == 0) {
        //        clientFactory.getClients().then(function (response) {
        //            clientFactory.clientlist = response.data;
        //            return clientFactory.clientlist;
        //        })
        //    } else { return clientFactory.clientlist;}
        //};
        clientFactory.getlocalClientlist = function () {
            var clientList = factoryManagerService.get("clientsVM");
            var clnlist = JSON.parse(clientList);
            if (clnlist !== null && clnlist !== undefined) {
                angular.forEach(clnlist, function (c) {
                    clientVM.Id = c.Id;
                    clientVM.Name = c.Name;
                    clientVM.RegNo = c.RegNo;
                    clientVM.VATNo = c.VATNo;
                    clientVM.Address = c.Address;
                    clientVM.BusinessId = c.BusinessId;
                    clientFactory.clientlist.push(clientVM);
                });
                return clientFactory.clientlist;
            }
        };
        clientFactory.find = function (id) {
            var clist = clientFactory.clientlist;
            if (clist.length < 1) {
                var cliststr = factoryManagerService.get("clientsVM");
                var list = JSON.parse(cliststr);
                if (list.length > 0) {
                    return _.find(list, function (client) {
                        if (client.Id == id) {
                            clientVM.Id = client.Id;
                            clientVM.Name = client.Name;
                            clientVM.RegNo = client.RegNo;
                            clientVM.VATNo = client.VATNo;
                            clientVM.Address = client.Address;
                            clientVM.BusinessId = client.BusinessId;
                            return clientVM;
                        }
                    });
                }
            }
            else {
                return _.find(clist, function (client) {
                    if (client.Id == id) {
                        clientVM.Id = client.Id;
                        clientVM.Name = client.Name;
                        clientVM.RegNo = client.RegNo;
                        clientVM.VATNo = client.VATNo;
                        clientVM.Address = client.Address;
                        clientVM.BusinessId = client.BusinessId;
                        return clientVM;
                    }
                });
            }

        };
        clientFactory.prepForBoradcast = function (client) {
            selectedClient = client;
        };
        clientFactory.BoradcastClient = function () {
            if (selectedClient !== null && selectedClient !== undefined) return selectedClient;
        }
        return clientFactory;
    }])
    .factory('invoiceFactory', ['config', '$http', '$rootScope', function (config, $http, $rootScope) {
        var urlBase = config.apiUrl + '/invoice';
        var invoiceFactory = {};
        invoiceFactory.getDashboardData = function (businessId) {
            return $http.get(urlBase, { params: { businessId: businessId } });
        };
        invoiceFactory.getInvoices = function (invoiceId) {
            return $http.get(urlBase, { params: { id: invoiceId } }); //should be string 
        };
        invoiceFactory.SaveInvoice = function (inv) {
            return $http.post(urlBase, inv);
        };
        invoiceFactory.updateInvoice = function (inv) {
            return $http.put(urlBase + '/' + inv.Id, inv)
        };
        invoiceFactory.deleteInvoice = function (inv) {
            return $http.delete(urlBase + '/' + id);
        };
        return invoiceFactory;
    }])
    .factory('invoiceitems', ['itemVM', function (itemVM) {
        var invoiceitems = {};
        invoiceitems.list = [];
        // invoiceitems.list.length = 0;
        invoiceitems.add = function (item) {
            invoiceitems.list.push(item)
        };
        invoiceitems.delete = function (Id) {
            return _.find(invoiceitems.list, function (invoiceitem) {
                if (invoiceitem.Id === Id) {
                    var index = invoiceitems.list.indexOf(invoiceitem);
                    return invoiceitems.list.splice(index, 1);
                }
            });
        };
        invoiceitems.update = function (newvalue) {
            _.find(invoiceitems.list, function (uinvoiceitem) {
                if (uinvoiceitem.Id === newvalue.Id) {
                    var index = invoiceitems.list.indexOf(uinvoiceitem);
                    invoiceitems.list[index] = newvalue;
                    // console.log(JSON.stringify(invoiceitems.list));
                    return;
                }
            });
        }
        invoiceitems.find = function (id) {
            return _.find(invoiceitems.list, function (finvoiceitem) {
                if (finvoiceitem.Id === id) {
                    //var itemVM = {};
                    itemVM.Id = finvoiceitem.Id;
                    itemVM.Description = finvoiceitem.Description;
                    itemVM.Quantity = parseInt(finvoiceitem.Quantity);
                    itemVM.Price = parseFloat(finvoiceitem.Price);
                    itemVM.VAT = parseFloat(finvoiceitem.VAT);
                    itemVM.VATRate = finvoiceitem.VATRate;
                    itemVM.Total = parseFloat(finvoiceitem.Total);
                    itemVM.SubTotal = parseFloat(finvoiceitem.SubTotal);
                    return itemVM;
                }
                //else {
                //  return itemVM; //empty model 
                //};
            });
        }; return invoiceitems;
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
            "BusinessId":"",
            Address: clientAddVM
        };

    }])
    .service('senVM', function () {
        return senVM = {
            SenderId: "",
            Title: "",
            ForName1: "",
            ForName2: "",
            SurName: "",
            Telephone: "",
            Mobile: "",
            Email: "",
            AddressLine1: "",
            AddressLine2: "",
            AddressLine3: "",
            Postcode: "",
            Country: "",
            Type: "",
            SenderPassword: "",
            HMRCUserId: "",
            HMRCPassword: ""
        };
    })
    .service('busAddVM', function () {
        return busAddVM = {
            BusinessAddressId: "",
            Line1: "",
            Line2: "",
            Line3: "",
            Line4: "",
            Postcode: "",
            Country: ""
        };
    })
    .service('perVM', function () {
        return perVM = {
            PeriodRefId: "",
            StartPeriod: "",
            EndPeriod: "",
            Status:""
        };
    })
    .service('busVM', ['busAddVM', 'senVM','perVM', function (busAddVM, senVM, perVM) {
        return busVM = {
            BusinessId: "",
            BusinessName: "",
            RegisteredDate: "",
            TradingName: "",
            VATRegNo: "",
            VATRate: "",
            NextQuaterStartDate: "",
            NextQuaterEndDate: "",
            RegNo:"",
            BusinessAddress: busAddVM,
            Sender: senVM,
            Periods: perVM
        };
    }])
    .service('vat100VM', function () {
        return vat100VM = {
            VATDueOnOutputs: "",
            VATDueOnECAcquisitions: "",
            TotalVAT: "",
            VATReclaimedOnInputs: "",
            NetVAT: "",
            NetSalesAndOutputs: "",
            NetPurchasesAndInputs: "",
            NetECSupplies: "",
            NetECAcquisitions:""
        };
    })
    .service('subVM', ['busVM', 'vat100VM', 'perVM', function (busVM, vat100VM, perVM ) {
        return subVM = {
            BussinessViewModel: busVM,
            VAT100ViewModel: vat100VM,
            PeriodViewModel: perVM,
            RunMode:""
        };
    }])
    .service('busService', ['$q', 'busFactory', 'busVM', function ($q, busFactory, busVM) {
        var periodList = [];
        var methods = {
            "getBusinessById": function (Id) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                busFactory.getBusinessById(Id).then(function (response) {
                    if (response.data !== null && response.data !== undefined) {
                       busData = response.data;                    
                       if (busData) {
                           //busVM = busData;
                           busVM.BusinessId = busData.BusinessId;
                           busVM.BusinessName = busData.BusinessName;
                           busVM.RegisteredDate = new Date(busData.RegisteredDate);
                           busVM.TradingName = busData.TradingName;
                           busVM.VATRegNo = busData.VATRegNo;
                           busVM.VATRate = busData.VATRate;
                           busVM.NextQuaterEndDate = new Date(busData.NextQuaterEndDate);
                           busVM.NextQuaterStartDate = new Date(busData.NextQuaterStartDate);
                           busVM.RegNo = busData.RegNo;
                           busVM.BusinessAddress = busData.BusinessAddress;
                           busVM.Sender = busData.Sender;
                           busVM.Periods = busData.Periods;
                           return busVM;
                       }
                    }
                }, function (error) {
                    deferred.reject('server error');
                })
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
        return methods;
    }])
    .factory('busFactory', ['config', '$http', 'busVM', function (config, $http, busVM) {
        var urlBase = config.apiUrl + '/business';
        var busFactory = {};
        busFactory.getBussiness = function (senderId) {
            return $http.get(urlBase, { params: { senderId: senderId } });
        };
        busFactory.getBusinessById = function (id) {
            return $http.get(urlBase + '/' + id);
        };
        busFactory.insertBusinessData = function (bus) {
            return $http.post(urlBase, bus);
        };
        busFactory.updateBusinessData = function (bus) {
            return $http.put(urlBase + '/' + bus.BusinessId, bus);
        };
        busFactory.deleteBusinessData = function (businessId) {
            return $http.delete(urlBase + '/' + businessId);
        };
        return busFactory;
    }])
    .service('responseVM', ['successResponse', function (successResponse) {
        return responseVM = {
            PeriodId: "",
            PeriodRefId: "",
            Status: "",
            Response: successResponse
        };        
    }])
    .service('successResponse', function () {
        return successResponse = {
            acceptedTimeField: "",
            MessageField: "",
            ResponseDataField: "",
            IRmarkReceiptField: "",
            responseDataField: ""
        };
    })
    .factory('submissionFactory', ['config', '$http', function (config, $http) {
        var urlBase = config.apiUrl + '/Submission';
        var submissionFactory = {};
        submissionFactory.getSubmissions = function (businessId) {
            return $http.get(urlBase, { params: { businessId: businessId } });
        };
        submissionFactory.getSubmissionById = function (businessId, periodId) {
            return $http.get(urlBase, { params: { businessId: businessId, periodId: periodId } });
        };
        return submissionFactory;

    }])
    .service('submissionService', ['$q', 'submissionFactory', 'successResponse', function ($q, submissionFactory, successResponse) {
        var responses = [];
        return {
            list: function (Id) {
                var deferred = $q.defer();
                if (responses.length == 0) {
                    submissionFactory.getSubmissions(Id).then(function (response) {
                        if (response.data !== null && response.data !== undefined) {
                            for (var i = 0; i < response.data.length; i++) {
                                responseVM = {};
                                responseVM.PeriodId = response.data[i].PeriodId;
                                responseVM.PeriodRefId = response.data[i].PeriodRefId;
                              
                                responseVM.Status = response.data[i].Status;
                                responseVM.Response = response.data[i].Response;
                                responses.push(responseVM);
                            }
                            return deferred.resolve(responses);
                        }
                        return deferred.resolve(response.data);
                    });
                } else {
                    return deferred.resolve(responses);
                }
                return deferred.promise;
            },
            find: function (Id) {
                _.find(responses, function (item) {
                    if (item.PeriodId === Id) {
                        var responseData = item.Response;
                        if (responseData) {
                            //successResponse = {};
                            successResponse.acceptedTimeField = responseData.acceptedTimeField;
                            successResponse.messageField = responseData.messageField;
                            successResponse.responseDataField = responseData.responseDataField;
                            successResponse.iRmarkReceiptField = responseData.iRmarkReceiptField;
                            return successResponse;
                        }
                    }
                });
            }
        };
        //return methods;
    }])
    .service('invoicedetailVM', function () {
        var issuedate = new Date();
        var duedate = new Date();

        console.log("before" + duedate);
        duedate.setDate(duedate.getDate() + 14);
        console.log("after add 14" + duedate);
        //console.log("current " + d);
        //t.setDate(t.getDate() + 14);
        //console.log("future " + t);
        return invoicedetailVM = {
            "InvoiceDetailId": 0,
            "No": "00",
            "IssueDate": issuedate,
            "DueDate": duedate,
            "Ref": "",
            "OrderNumber": "",
            "Discount": "",
            "Note": ""
        };
    })
    .service('invoicedetailEditVM', function () {
        var issuedate = new Date();
        var duedate = new Date();
        duedate.setDate(duedate.getDate() + 14);
        return invoicedetailEditVM = {
            "InvoiceDetailId": 0,
            "No": "00",
            "IssueDate": issuedate,
            "DueDate": duedate,
            "Ref": "",
            "OrderNumber": "",
            "Discount": "",
            "Note": ""
        };
    })
    .service('itemVM', function () {
        return itemVM = {
            "Id": "",
            "Description": "",
            "Quantity": 1,
            "Price": "",
            // "ItemCode": "",
            "VATRate": "",
            "VAT": "",
            "Total": "",
            "SubTotal": ""
        }
    })
    .service('invoiceView', function () {
        return invoiceVM = {
            Id: "",
            ClientName: "",
            Number: "",
            DueDate: "",
            Total: "",
            IssueDate: "",
            SubTotal: "",
            VAT: "",
            Total:""
        };
    })
    .service('invoiceVM', ['invoicedetailVM', 'itemVM', function (invoicedetailVM, itemVM) {
        return invoiceVM = {
            Id: "",
            ClientId: "",
            Details: invoicedetailVM,
            Items: itemVM,
            SubTotal: "",
            VAT: "",
            Total: "",
            DateCreated: "",
            LastUpdated: "",
            BusinessId:""
        };
    }])
    .service('invoiceService', ['$q', 'invoicedetailVM', 'itemVM', 'invoiceVM', 'factoryManagerService', '$rootScope', 'invoiceFactory', 'invoiceView', 'clientFactory', 'invoicedetailEditVM', function ($q, invoicedetailVM, itemVM, invoiceVM, factoryManagerService, $rootScope, invoiceFactory, invoiceView, clientFactory, invoicedetailEditVM) {
        var invDetails = {};
        var itemDetails = {};
        var invoices = [];
        var methods = {
            //"SaveInvItem": function (item) {
            //    var deferred = $q.defer();
            //    var promise = deferred.promise;
            //    //var itemLst = [];
            //    var itemLst = factoryManagerService.get("invitemlist");

            //    if (item !== null && item !== undefined) {
            //        //parse item to itemVM
            //        itemVM.Id = item.Id;
            //        itemVM.Description = item.Description;
            //        itemVM.Qty = item.Qty;
            //        itemVM.Price = item.Price;
            //        itemVM.VAT = item.VAT;
            //        itemVM.VATRate = item.VATRate;
            //        itemVM.Total = item.Total;
            //        itemVM.Subtotal = item.Subtotal;

            //        if (itemLst !== null && itemLst !== undefined) {
            //            //alredy exist
            //            var temp = JSON.parse(itemLst);
            //            if (temp !== null && temp !== undefined) {
            //                temp.push({ id: itemVM.Id, value: itemVM });
            //                factoryManagerService.set("invitemlist", JSON.stringify(temp));
            //               // return temp;
            //            }
            //        }
            //        else {
            //            $rootScope.invItemsList.push({ id: itemVM.Id, value: itemVM });
            //            factoryManagerService.set("invitemlist", JSON.stringify($rootScope.invItemsList));
            //        }
            //        //itemLst.push({ id: itemVM.Id, value: itemVM }); //TODO: id should be unique to item add uuid library to generate 
            //        //factoryManagerService.set("invitemlist", JSON.stringify(itemLst));
            //        deferred.resolve('sucessfully added');
            //    }
            //    else {
            //        deferred.reject("Item null or undefined");
            //    }
            //    promise.success = function (fn) {
            //        promise.then(fn);
            //        return promise;
            //    }
            //    promise.error = function (fn) {
            //        promise.then(null, fn);
            //        return promise;
            //    }
            //    return promise;
            //},
            //"UpdateInvItem": function (updtitem) {
            //    var deferred = $q.defer();
            //    var promise = deferred.promise;
            //    if (updtitem !== null && updtitem !== undefined) {
            //        //get list from local storage                      
            //        var invItemsLst = factoryManagerService.getInvItemsData();
            //        angular.forEach(invItemsLst, function (v) {
            //            if (v.value.Id === updtitem.Id) {
            //                v.value.Description = updtitem.Description;
            //                v.value.Qty = updtitem.Qty;
            //                v.value.Price = updtitem.Price;
            //                v.value.VAT = updtitem.VAT;
            //                v.value.VATRate = updtitem.VATRate;
            //                v.value.Total = updtitem.Total;
            //                v.value.Subtotal = updtitem.Subtotal;
            //                factoryManagerService.set("invitemlist", JSON.stringify(invItemsLst));
            //                deferred.resolve('sucessfully updated');
            //                return true;
            //            }
            //        });
            //    }
            //    promise.success = function (fn) {
            //        promise.then(fn);
            //        return promise;
            //    }
            //    promise.error = function (fn) {
            //        promise.then(null, fn);
            //        return promise;
            //    }
            //    return promise;
            //},
            //"getInvItemById": function (Id) {
            //    //var itemVM = {};
            //    if (Id !== null && Id !== undefined) {
            //        //itemVM = null;
            //        var myItems = factoryManagerService.getInvItemsData();
            //        angular.forEach(myItems, function (v) {
            //            if (v.value.Id === Id) {
            //                itemVM.Id = v.value.Id;
            //                itemVM.Description = v.value.Description;
            //                itemVM.Qty = v.value.Qty;
            //                itemVM.Price = v.value.Price;
            //                itemVM.VAT = v.value.VAT;
            //                itemVM.VATRate = v.value.VATRate;
            //                itemVM.Total = v.value.Total;
            //                itemVM.Subtotal = v.value.Subtotal;
            //                return itemVM;
            //            }
            //            else {
            //                return null;
            //            }

            //        });
            //    }
            //    return itemVM;

            //},
            //"DeleteInvItem": function (Id) {
            //    var deferred = $q.defer();
            //    var promise = deferred.promise;
            //    if (Id !== null && Id !== undefined) {
            //        //get list from local storage                      
            //        var invItemsLst = factoryManagerService.getInvItemsData();
            //        angular.forEach(invItemsLst, function (v) {
            //            if (v.value.Id === Id) {
            //                var index = invItemsLst.indexOf(v);
            //                invItemsLst.splice(index, 1);
            //                factoryManagerService.set("invitemlist", JSON.stringify(invItemsLst));
            //                deferred.resolve('sucessfully deleted');
            //                return true;
            //            }
            //        });
            //    }
            //    promise.success = function (fn) {
            //        promise.then(fn);
            //        return promise;
            //    }
            //    promise.error = function (fn) {
            //        promise.then(null, fn);
            //        return promise;
            //    }
            //    return promise;
            //},
            "CreatePdf": function (invoice) {
                return $q(function (resolve, reject) {
                    // console.log(JSON.stringify(invoice.Items));
                    var dd = createDocumentDefinition(invoice);
                    var pdf = pdfMake.createPdf(dd);

                    pdf.getBase64(function (output) {
                        resolve(base64ToUint8Array(output));
                    });
                    function base64ToUint8Array(base64) {
                        var raw = atob(base64);
                        var uint8Array = new Uint8Array(raw.length);
                        for (var i = 0; i < raw.length; i++) {
                            uint8Array[i] = raw.charCodeAt(i);
                        }
                        return uint8Array;
                    };
                    function createDocumentDefinition(invoice) {
                        var items = invoice.Items.map(function (item) {
                            return [item.Description, item.Quantity, item.Price];
                        });
                        var dd = {
                            content: [
                                { text: 'INVOICE', style: 'header' },
                                //{ text: invoice.Date, alignment: 'right' },
                                { text: invoice.AddressFrom.Name, alignment: 'right' },
                                { text: invoice.AddressFrom.Address + " " + invoice.AddressFrom.Country, alignment: 'right' }, '\n\n\n',
                                {
                                    alignment: 'justify',
                                    columns: [
                                        {
                                            text: [
                                                { text: 'To', style: 'subheader' }, '\n',
                                                { text: invoice.AddressTo.Name, bold: true }, '\n',
                                                invoice.AddressTo.Address, '\n',
                                                invoice.AddressTo.Country
                                            ]
                                        },//column end 
                                        {
                                            text: [
                                                { text: 'Invoice No:' }, '   ', { text: invoice.Detail.No, bold: true }, '\n',
                                                { text: 'IssueDate:' }, '   ', { text: invoice.Detail.IssueDate, bold: true }, '\n',
                                                { text: 'DueDate:' }, '   ', { text: invoice.Detail.DueDate, bold: true }, '\n',
                                            ]
                                        }
                                    ]
                                },
                                //{ text: 'From', style: 'subheader', alignment: 'right' },
                                //{ text: invoice.AddressFrom.Name, alignment: 'right'   },
                                //{ text: invoice.AddressFrom.Address, alignment: 'right'},
                                //{ text: invoice.AddressFrom.Country, alignment: 'right'},

                                //{ text: 'To', style: 'subheader' },
                                //invoice.AddressTo.Name,
                                //invoice.AddressTo.Address,
                                //invoice.AddressTo.Country,
                                '\n',
                                { text: 'Items', style: 'subheader' },
                                {
                                    style: 'itemsTable',
                                    table: {
                                        widths: ['*', 75, 75],
                                        body: [
                                            [
                                                { text: 'Description', style: 'itemsTableHeader' },
                                                { text: 'Quantity', style: 'itemsTableHeader' },
                                                { text: 'Price', style: 'itemsTableHeader' },
                                            ]
                                        ].concat(items)
                                    }
                                },
                                {
                                    style: 'totalsTable',
                                    table: {
                                        widths: ['*', 75, 75],
                                        body: [
                                            [
                                                '',
                                                'Subtotal',
                                                invoice.Subtotal,
                                            ],
                                            [
                                                '',
                                                'VAT',
                                                invoice.VAT,
                                            ],
                                            [
                                                '',
                                                'Total',
                                                invoice.Total,
                                            ]
                                        ]
                                    },
                                    layout: 'noBorders'
                                },
                            ],
                            styles: {
                                header: {
                                    fontSize: 20,
                                    bold: true,
                                    margin: [0, 0, 0, 10],
                                    alignment: 'right'
                                },
                                subheader: {
                                    fontSize: 16,
                                    bold: true,
                                    margin: [0, 20, 0, 5]
                                },
                                itemsTable: {
                                    margin: [0, 5, 0, 15]
                                },
                                itemsTableHeader: {
                                    bold: true,
                                    fontSize: 13,
                                    color: 'black'
                                },
                                totalsTable: {
                                    bold: true,
                                    margin: [0, 30, 0, 0]
                                }
                            },
                            defaultStyle: {
                                columnGap: 150
                            }
                        }

                        return dd;
                    };
                });
            },
            "SaveInvoice": function (newinvoice) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                if (newinvoice !== null && newinvoice !== undefined) {
                    //var invoices = factoryManagerService.get("invoicelist");
                    //if ((invoices !== null) && (invoices !== undefined) && (invoices.length >0)) {

                    //    var temp = JSON.parse(invoices);
                    //    if (temp !== null && temp !== undefined) {
                    //        temp.push({ id: newinvoice.Id, value: newinvoice });
                    //        factoryManagerService.set("invoicelist", JSON.stringify(temp));
                    //    }
                    //}
                    //else {
                    //    $rootScope.invoiceList.push({ id: newinvoice.Id, value: newinvoice });
                    //    factoryManagerService.set("invoicelist", JSON.stringify($rootScope.invoiceList));
                    //}

                    invoiceFactory.SaveInvoice(newinvoice).then(function (response) {
                        //console.log("inv added sucess");
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject('server error');
                    });
                }
                else {
                    deferred.reject('server error');
                };
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
            "getInvoiceById": function (Id) {
                _.find(invoices, function (invoice) {
                    if (invoice.Id == Id) {
                        invoiceView.Id = invoice.Id;
                        invoiceView.ClientName = invoice.ClientName;
                        invoiceView.Number = invoice.DetailNumber;
                        invoiceView.DueDate = invoice.DetailDueDate;
                        invoiceView.IssueDate = invoice.Details.IssueDate;
                        invoiceView.SubTotal = invoice.SubTotal;
                        invoiceView.VAT = invoice.VAT;
                        invoiceView.Total = invoice.Total;
                        return invoiceView;
                    }
                });
                //var deferred = $q.defer();
                //var promise = deferred.promise;
                //invoiceFactory.getInvoice(Id).then(function (response) {
                //    invoiceVM = response.data;
                //    factoryManagerService.set("invoiceVM", JSON.stringify(invoiceVM));
                //    if (invoiceVM)
                //    {
                //        var clientVM = clientFactory.find(invoiceVM.ClientId);
                //        invoiceView.Id = invoiceVM.Id;
                //        invoiceView.ClientName = clientVM.Name;
                //        invoiceView.Number = invoiceVM.Details.No;
                //        invoiceView.DueDate = invoiceVM.Details.DueDate;
                //        invoiceView.IssueDate = invoiceVM.Details.IssueDate;
                //        invoiceView.SubTotal = invoiceVM.SubTotal;
                //        invoiceView.VAT = invoiceVM.VAT;
                //        invoiceView.Total = invoiceVM.Total;
                //        //deferred.resolve(invoiceView);
                //        return invoiceView;
                //    }
                //}, function (error) {
                //    deferred.reject('server error');
                //  })
                //promise.success = function (fn) {
                //    promise.then(fn);
                //    return promise;
                //}
                //promise.error = function (fn) {
                //    promise.then(null, fn);
                //    return promise;
                //}
                //return promise;
            },
            "getInvoices": function (businessId) { //not used 
                var deferred = $q.defer();
                if (invoices.length == 0 && (busId !==null) && (busId !==undefined)) {
                    invoiceFactory.getInvoices(busId).then(function (response) {
                        if (response.data !== null && response.data !== undefined) {
                            angular.forEach(response.data, function (invoice) {
                                invoiceVM = {};
                                var clientVM = clientFactory.find(invoice.ClientId);
                                if (clientVM !== null && clientVM !== undefined) {
                                    invoiceVM.Id = invoice.Id;
                                    invoiceVM.ClientName = clientVM.Name;
                                    invoiceVM.Details = invoice.Details;
                                    invoiceVM.DetailNumber = invoice.Details.No;
                                    invoiceVM.DetailDueDate = invoice.Details.DueDate;
                                    invoiceVM.Total = invoice.Total;
                                    invoiceVM.SubTotal = invoice.SubTotal;
                                    invoiceVM.VAT = invoice.VAT;                                    
                                    invoices.push(invoiceVM);
                                    return deferred.resolve(invoices);
                                }
                                return deferred.resolve(invoices);
                            });
                        }
                        return deferred.resolve(invoices);
                    });
                } else {
                    return deferred.resolve(invoices);
                }
               return deferred.promise;
            },
            "getInvDetail": function () {
                if (invoicedetailVM !== undefined && invoicedetailVM !== null) {
                    if (invoicedetailVM.InvoiceDetailId == 0)
                    {                      
                        invoicedetailVM.No = '00';
                        var lastOrderIdStr = factoryManagerService.get("prevInvOrderId");
                        if (lastOrderIdStr !== null && lastOrderIdStr !== undefined) {
                            var lastOrderId = JSON.parse(lastOrderIdStr);
                            if (lastOrderId !== null && lastOrderId !== undefined) //previous order retrived from DB 
                            {
                                var temp = parseInt(lastOrderId) + 1;
                                invoicedetailVM.No = (invoicedetailVM.No + temp).slice(-6);
                                return invoicedetailVM;
                            }
                            else {
                                //invoicedetailVM.No = '0000';
                                invoicedetailVM.No = (invoicedetailVM.No + 1).slice(-6); //first invdetails item just add one
                                return invoicedetailVM;
                            }
                        }
                        else {
                            invoicedetailVM.No = (invoicedetailVM.No + 1).slice(-6); //first invdetails item just add one
                            return invoicedetailVM;
                        }

                    }
                    else { //for new 
                        return invoicedetailVM; // for update
                    }                    
                } 
            },
            "getInvDetailEdit": function (value) {
                if (value !== null && value !== undefined)
                {
                    invoicedetailEditVM.InvoiceDetailId = value.InvoiceDetailId;
                    invoicedetailEditVM.No = value.No;
                    invoicedetailEditVM.IssueDate = new Date(value.IssueDate);
                    invoicedetailEditVM.DueDate = new Date(value.DueDate);
                    invoicedetailEditVM.Ref = value.Ref;
                    invoicedetailEditVM.OrderNumber = value.OrderNo;
                    invoicedetailEditVM.Discount = value.Discount;
                    invoicedetailEditVM.No = value.No;
                    return invoicedetailEditVM;
                }
                else
                {
                    return invoicedetailEditVM;
                }
            }            
        };
        return methods;
    }])
    //.service('clientService', ['clientFactory', 'clientAddVM', 'clientVM', function (clientFactory, clientAddVM, clientVM) {
    //    var methods = {
    //        find: function (id) {
    //            var list  = clientFactory.clientlist;
    //            if (list.length > 0) {
    //                return _.find(list, function (client) {
    //                    if (client.Id == id)
    //                    {
    //                        clientVM.Id = client.Id;
    //                        clientVM.Name = client.Name;
    //                        clientVM.RegNo = client.RegNo;
    //                        clientVM.VATNo = client.VATNo;
    //                        clientVM.Address = client.Address;
    //                        return clientVM;
    //                    }                            
    //                });
    //            }
    //        }
    //    };
    //    return methods;
    //    }        
    //])
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
        }//,
       // loadclientlistCache: function () {
           // clientFactory.clientlist.length = 0;
            //clientFactory.clientlist = clientFactory.getlocalClientlist();            
        //}
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
        .state('menu.tabs.invoiceview', {
            url: "/invoiceview",
            views: {
                'invoice-tab': {
                    templateUrl: "invoiceview.html",
                    controller: 'invoiceviewCtrl'
                }
            }
        })
        .state('menu.tabs.editinvoice', {
            url: "/editinvoice",
            views: {
                'invoice-tab': {
                    templateUrl: "editinvoice.html",
                    controller: 'editinvoiceCtrl'
                }
            }
        })
        .state('menu.tabs.createinvoice', {
            //cache: false,
            url: "/createinvoice",
            views: {
                'invoice-tab': {
                    templateUrl: "createinvoice.html"//,
                    //controller: 'createInvoiceCtrl'
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
        //.state('menu.tabs.lkpclientlst', {
        //    url: "/lkpclientlst",
        //    views: {
        //        'invoice-tab': {
        //            templateUrl: "lkpclientlst.html",
        //            controller: 'lkpClientlstCtrl'
        //       }
        //    }
        //})
        //.state('menu.tabs.lkpclient.lkpclientlst', {
        //    url: "/lkpclientlst",
        //    templateUrl: "partials/lkpclient.lkpclientlst.html",
        //    controller: 'lkpClientlstCtrl'            
        //})
        .state('menu.tabs.invoicedetail', {
            url: "/invoicedetail",
            views: {
                'invoice-tab': {
                    templateUrl: "invoicedetail.html",
                    controller: 'invoiceDetailCtrl'
                }
            }
        })
        .state('menu.tabs.invoicedetailedit', {
            url: "/invoicedetailedit",
            views: {
                'invoice-tab': {
                    templateUrl: "invoicedetailedit.html",
                    controller: 'invoiceDetailEditCtrl'
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
        .state('menu.tabs.submissions', {
            url: "/submissions",
            views: {
                'submissions-tab': {
                    templateUrl: "submissions.html",
                    controller: 'SubmissionsCtrl'
                }
            }
        })
        .state('menu.tabs.submissiondetail', {
            url: "/submissiondetail",
            views: {
                'submissions-tab': {
                    templateUrl: "submissiondetail.html",
                    controller: 'SubmissionDetailCtrl'
                }
            }
        })
        .state('menu.tabs.returns', {
            cache: false,
            url: "/returns",
            views: {
                'submissions-tab': {
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
    //.state('menu.tabs.form', {
    //    cache: false,
    //    url: "/form",
    //    views: {
    //        'form-tab': {
    //            templateUrl: "form.html",
    //            controller: 'busCtrl'
    //        }
    //    }
    //})
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
        .state('menu.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "settings.html",
                    controller: 'settingsCtrl'
                }
            }
        })
        .state('menu.business', {
            url: "/business",
            views: {
                'menuContent': {
                    templateUrl: "business.html",
                    controller: 'businessCtrl'
                }
            }
        })
        .state('menu.addbusiness', {
            url: "/addbusiness",
            views: {
                'menuContent': {
                    templateUrl: "addbusiness.html",
                    controller: 'addbusinessCtrl'
                }
            }
        })
        .state('menu.businessdetail', {
            url: "/businessdetail",
            views: {
                'menuContent': {
                    templateUrl: "business-detail.html",
                    controller: 'businessdetailCtrl'
                }
            }
        })
        //settings
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
