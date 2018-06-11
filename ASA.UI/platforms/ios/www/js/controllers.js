angular
    .module('asaApp')
    .controller('DashboardController', ['$scope', 'invoiceFactory', 'clientFactory', 'factoryManagerService', '$filter', 'payVMService', 'amCharts', function ($scope, invoiceFactory, clientFactory, factoryManagerService, $filter, payVMService, amCharts) {
        $scope.invitems = [];
        $scope.periods = []; 
        $scope.invitems.length = 0;
        $scope.periods.length = 0;
        var businessId = 0;
        var localbus = factoryManagerService.getObject("busVM");
        if (localbus !== null && localbus !== undefined) {
            businessId = localbus.BusinessId;
        }
        var pvmArr = [];
        var Q1subtotal = 0;
        var Q1vat = 0;
        var Q2subtotal = 0;
        var Q2vat = 0;

        var total = 0;
        var pvmq1 = {};

        invoiceFactory.getDashboardData(businessId).then(function (response) {
            if (response.data) {
                var periods = response.data.Periods;
                var periodsSorted = $filter('orderBy')(periods, 'StartPeriod')
                var invoices = response.data.Invoices;
                let periodWithQuaters = periodsSorted.map((period, i, periodsSorted) => {
                    period.Quater = i + 1;
                    return period;
                });                
                angular.forEach(invoices, function (invoice) {
                    if (invoice.Details.DueDate) {
                        angular.forEach(periodWithQuaters, function (period) {
                            var invoiceDueDate = new Date(invoice.Details.DueDate);
                            var periodStartDate = new Date(period.StartPeriod);
                            var periodEndDate = new Date(period.EndPeriod);
                            if ((invoiceDueDate >= periodStartDate) && (invoiceDueDate < periodEndDate)) {
                                if (period.Quater == 1) {
                                    Q1subtotal = parseFloat(Q1subtotal) + parseFloat(invoice.SubTotal);
                                    Q1vat = parseFloat(Q1vat) + parseFloat(invoice.VAT);
                                    pvmq1 = {
                                        "PeriodId": "Q" + period.Quater,
                                        "value": Q1vat,
                                        "TotalGross": Q1subtotal
                                        };
                                };
                                if (period.Quater == 2)
                                {
                                    Q2subtotal = parseFloat(Q2subtotal) + parseFloat(invoice.SubTotal);
                                    Q2vat = parseFloat(Q2vat) + parseFloat(invoice.VAT);
                                    pvmq2 = {
                                        "PeriodId": "Q" + period.Quater,
                                        "value": Q2vat,
                                        "TotalGross": Q2subtotal
                                    };
                                };
                            }
                        });                       
                    };
                })                
            }        
        }, function (error) {
            console.log("Error");
        });
        $scope.$on('$ionicView.enter', function () {
            var pvmArr = [];
            var Q1subtotal = 0;
            var Q1vat = 0;
            var total = 0;
            var pvmq1 = {};
        
            $scope.count = 0;
            $scope.Subtotal = 0;
            $scope.VAT = 0;
            $scope.Total = 0;

            if (($scope.invitems !== null) && ($scope.invitems !== undefined) && $scope.invitems.length > 0) {
                angular.forEach($scope.invitems, function (invoiceItem) {
                    if (invoiceItem.DueDate)
                    {
                        angular.forEach($scope.periods, function (period) {
                            var dueDate = new Date(invoiceItem.DueDate);
                            var periodStartDate = new Date(period.StartPeriod);
                            var periodEndDate = new Date(period.EndDate);
                            if (dueDate >= periodStartDate && dueDate <= periodEndDate) {
                                Q1subtotal = parseFloat(Q1subtotal) + parseFloat(invoiceItem.SubTotal);
                                Q1vat = parseFloat(Q1vat) + parseFloat(invoiceItem.VAT);                               
                            }                         

                        })
                        pvmq1 = {
                            "PeriodId": "Q1", //+ period.PeriodId,
                            "value": Q1vat,
                            "TotalGross": Q1subtotal
                        };
                        total = Q1subtotal + Q1vat;
                        $scope.Subtotal = Q1subtotal;
                        $scope.VAT = Q1vat;
                        $scope.Total = total;
                        $scope.count = $scope.invitems.length;
                    }
                });
                //total = subtotal + vat;
                //$scope.Subtotal = subtotal;
                //$scope.VAT = vat;
                //$scope.Total = total;
                //$scope.count = $scope.invitems.length;
                
                pvmArr.push(pvmq1);//adding evetthing here but needs to categorise based on quater and add them up here
                //pvmArr.push(pvmq2);//if indetail issue date is in first quater add as first item or else seconf item 
            }
            else {
                $scope.Subtotal = Q1subtotal;
                $scope.VAT = Q1vat;
                $scope.Total = total;
                $scope.count = $scope.invitems.length;
            };

            // code to run each time view is entered
            //$scope.items = [];

            //var pvmArr = [];
            //var periodData = factoryManagerService.get("periodlist");
            //var strdata = factoryManagerService.get("submissionlist");
            //if (periodData !== null && periodData !== undefined) {
            //    var periods = JSON.parse(periodData);
            //    if (periods !== null && periods !== undefined) {
            //        $scope.items = angular.copy(periods);
            //    }
            //}
            //pvmArr.length = 0;//clear array before push
            //if (strdata !== null && strdata !== undefined) {
            //    var data = JSON.parse(strdata);

                //if (data !== null && data !== undefined) {
                //    var reverseArray = data.reverse();
                //    var tempData = reverseArray.slice(0, 4); //get recent four quaters
                //    for (var i = 0; i < tempData.length; i++) {
                //        var pvm = {
                //            "PeriodId": "",
                //            "value": parseInt(0),
                //            "TotalSalesGross": parseInt(0)
                //            //TODO:// add vat percentage caliculated based on vat rate and display
                //        };//clear model values before populating 
                //       pvm.PeriodId = tempData[i].id;
                //        pvm.value = parseInt(tempData[i].value.PaymentNotification.NetVAT);
                //        pvm.TotalSalesGross = parseInt(tempData[i].value.TotalSalesGross);
                //        pvmArr.push(pvm);
                //    }
                //}
            //}

            if (pvmArr.length > 0 && pvmArr !== undefined) {
                // console.log(pvmArr);
                amCharts.makeChart(pvmArr);

            }
            else {
                //  console.log("no periods found populate dummy data");
                amCharts.makeDummy();
            }

        });
        $scope.getPeriodById = function (value) {
            var pinfo = payVMService.get(value);
        };       
    }])
    .controller('subCtrl', ['$scope', 'payvm', 'factoryManagerService', '$rootScope', '$http', '$ionicPopup', 'config', function ($scope, payvm, factoryManagerService, $rootScope, $http, $ionicPopup, config) {

        $scope.payvm = payvm;
        var senderStr = factoryManagerService.get("senvm");
        if (senderStr !== null && senderStr !== undefined) {
            var sen = JSON.parse(senderStr);
        }
        if (sen !== null && sen !== undefined) {
            var senEmail = sen.Email;
        }
        //$scope.startSpin = function () {
        //    if (!$scope.spinneractive) {
        //        usSpinnerService.spin('spinner-1');
        //        $scope.startcounter++;
        //    }
        //};
        //$scope.stopSpin = function () {
        //    if ($scope.spinneractive) {
        //        usSpinnerService.stop('spinner-1');
        //    }
        //};
        //$scope.spinneractive = false;

        //$rootScope.$on('us-spinner:spin', function (event, key) {
        //    $scope.spinneractive = true;
        //});

        //$rootScope.$on('us-spinner:stop', function (event, key) {
        //    $scope.spinneractive = false;
        //});
        //new try v1.0
        var getUrl = function () {
            html2canvas(document.getElementById('exportthis'), {
                onrendered: function (canvas) {
                    var imgData = canvas.toDataURL("image/png", 1.0);
                    var _width = canvas.width;
                    var _height = canvas.height;
                    if (_height < _width)
                        _height = _width;
                    var pdf = new jsPDF("p", "pt", [_width * 72 / 96, _height * 72 / 96]);

                    pdf.addImage(imgData, 'PNG', 0, 0);

                    //            var pdf = new jsPDF('p', 'pt', 'a4');//'p', 'pt', 'a4'
                    //              pdf.addHTML(document.getElementById('exportthis'), function () {
                    var pdfString = pdf.output('datauristring');
                    //                var testtemp = getUrl();
                    var postData = pdfString.replace(/^data:application\/(png|jpg|pdf);base64,/, "");

                    var t = html2canvasSuccess(canvas);
                    return t;
                }
            })
        };
        //var imgToPDF = function () {
        //    var imgUrl = getUrl();
        //    getDataUri(imgUrl, function (dataUri) {
        //        logo = dataUri;
        //        console.log("logo=" + logo);
        //        var doc = new jsPDF();

        //        let left = 15;
        //        let top = 8;
        //        const imgWidth = 100;
        //        const imgHeight = 100;

        //        doc.addImage(logo, 'PNG', left, top, imgWidth, imgHeight);

        //        var tempt = doc.output('datauristring'); //opens pdf in new tab
        //        return tempt;
        //    });
        //};

        //function getDataUri(url, cb) {
        //    var image = new Image();
        //    image.setAttribute('crossOrigin', 'anonymous'); //getting images from external domain

        //    image.onload = function () {
        //        var canvas = document.createElement('canvas');
        //        canvas.width = this.naturalWidth;
        //        canvas.height = this.naturalHeight;

        //        //next three lines for white background in case png has a transparent background
        //        var ctx = canvas.getContext('2d');
        //        ctx.fillStyle = '#fff';  /// set white fill style
        //        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //        canvas.getContext('2d').drawImage(this, 0, 0);

        //        cb(canvas.toDataURL('image/jpeg'));
        //    };

        //    image.src = url;
        //}
        //var canvasShiftImg = function (img, shiftAmt, scale, pageHeight, pageWidth) {
        //    var c = document.createElement('canvas'),
        //      ctx = c.getContext('2d'),
        //      shifter = Number(shiftAmt || 0),
        //      scaledImgHeight = img.height * scale,
        //      scaledImgWidth = img.width * scale;

        //    ctx.canvas.height = pageHeight;
        //    ctx.canvas.width = pageWidth;
        //    ctx.drawImage(img, 0, shifter, scaledImgWidth, scaledImgHeight)

        //    return c;
        //};
        //var html2canvasSuccess = function (canvas) {
        //    var pdf = new jsPDF('l', 'px'),
        //        pdfInternals = pdf.internal,
        //        pdfPageSize = pdfInternals.pageSize,
        //        pdfScaleFactor = pdfInternals.scaleFactor,
        //        pdfPageWidth = pdfPageSize.width,
        //        pdfPageHeight = pdfPageSize.height,
        //        totalPdfHeight = 0,
        //        htmlPageHeight = canvas.height,
        //        htmlScaleFactor = canvas.width / (pdfPageWidth * pdfScaleFactor);

        //    while (totalPdfHeight < htmlPageHeight) {
        //        var newCanvas = canvasShiftImage(canvas, totalPdfHeight, pdfPageHeight * pdfScaleFactor);
        //        pdf.addImage(newCanvas, 'png', 0, 0, pdfPageWidth, 0, null, 'NONE'); //note the format doesn't seem to do anything... I had it at 'pdf' and it didn't care

        //        totalPdfHeight += (pdfPageHeight * pdfScaleFactor * htmlScaleFactor);

        //        if (totalPdfHeight < htmlPageHeight) { pdf.addPage(); }
        //    }

        //    return pdfstring = pdf.output('datauristring');
        //};

        //end v1.0

        $scope.generatePDF = function () {
            // $scope.startSpin();
            var pdf = new jsPDF('p', 'pt', 'a4');//'p', 'pt', 'a4'
            pdf.addHTML(document.getElementById('exportthis'), function () {
                var pdfString = pdf.output('datauristring');
                // var testtemp = getUrl();

                var postData = pdfString.replace(/^data:application\/(png|jpg|pdf);base64,/, "");
                $http({
                    method: 'POST',
                    url: config.apiUrl + "/Export",
                    dataType: 'json',
                    data: {
                        imgData: postData,
                        To: senEmail
                    },
                    headers: { 'Content-Type': "application/json" }
                })
                    .success(function (res) {
                        //$scope.stopSpin();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'Exported and sent as an attachment to the registed email, Please check you email, Thank you!'
                        })
                    })
                    .error(function (resp) {
                        //$scope.stopSpin();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Internal Server Error!',
                            template: 'Please try again!'
                        });
                    })
            });
            // $scope.stopSpin();
            //working copy end in IOS and andriod 

        };
    }])
    //todo: future implementation
    .controller('ForgotpwdCtrl', ['$scope', 'ForgotpwdService', '$state', '$ionicPopup', '$ionicSideMenuDelegate', function ($scope, ForgotpwdService, $state, $ionicPopup, $ionicSideMenuDelegate) {
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.data = {};
        $scope.Forgotpwd = function () {
            ForgotpwdService.RecoverUserPwd($scope.data.Email).success(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Password Recover link sent to registerd Email',
                    template: 'Please check your email!'
                }).then(function (resp) {
                    $state.go('menu.login');
                });


            }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Email not found!',
                    template: 'Please check entered email!'
                });
            });
        }
    }])
    .controller('LoginCtrl', ['$scope', 'LoginService', '$state', '$ionicPopup', '$ionicSideMenuDelegate', 'factoryManagerService', function ($scope, LoginService, $state, $ionicPopup, $ionicSideMenuDelegate, factoryManagerService) {
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.data = {};
        var senderStr = factoryManagerService.get("senvm");
        if (senderStr !== null && senderStr !== undefined) {
            var sen = JSON.parse(senderStr);
        }
        if (sen !== null && sen !== undefined) {
            var senEmail = sen.Email;
            $scope.data.username = senEmail;
        }
        $scope.login = function () {
            LoginService.loginUser($scope.data.username, $scope.data.password).success(function (data) {
                $state.go('menu.tabs.dashboard');
            }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            });
        };
    }])
    .controller('aboutCtrl', function () {
        //document.addEventListener("deviceready", function () {
        //    $cordovaAppVersion.getVersionNumber().then(function (version) {
        //        $scope.appVersion = version;
        //        alert("version - " + appVersion);
        //    });
        //}, false);

        //$cordovaAppVersion.getVersionCode().then(function (build) {
        //    var appBuild = build;
        //});


        //$cordovaAppVersion.getAppName().then(function (name) {
        //    var appName = name;
        //});


        //$cordovaAppVersion.getPackageName().then(function (package) {
        //    var appPackage = package;
        //});

    })
    .controller('senCtrl', ['$scope', '$filter', 'factoryManagerService', '$state', '$ionicSideMenuDelegate', function ($scope, $filter, factoryManagerService, $state, $ionicSideMenuDelegate) {
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.sendervm = {};
        // $scope.businessvm = {};
        //$scope.addressvm = {};
        //$scope.periodvm = {};
        $scope.Save = function (isValid) {
            if (isValid) {
                try {
                    //factoryManagerService.setObject("busvm", $scope.businessvm);
                    //localStorage.setItem("busvm", JSON.stringify($scope.businessvm));
                    //factoryManagerService.setObject("addvm", $scope.addressvm);
                    //localStorage.setItem("addvm", JSON.stringify($scope.addressvm));

                    //localStorage.setItem("senvm", JSON.stringify($scope.sendervm));
                    factoryManagerService.setObject("senvm", $scope.sendervm);
                    //$scope.periodvm.periodId = $filter('date')($scope.periodvm.StartPeriod, "yyyy-MM");

                    //factoryManagerService.setObject("pervm", $scope.periodvm);


                    //localStorage.setItem("pervm", JSON.stringify($scope.periodvm));


                    $state.go('menu.tabs.dashboard', {}, { reload: true, notify: true });
                    //$state.transitionTo('menu.tabs.dashboard', null, { reload: true, notify: true });
                    //$window.location.reload(true);
                    // $route.reload();
                }
                catch (exception) {
                    console.log(exception.message);
                }
            }
        };
    }])
    .controller('caliculatevatCtrl', ['$scope', 'factoryManagerService', '$http', '$ionicModal', 'config', function ($scope, factoryManagerService, $http, $ionicModal, config) {
        if (factoryManagerService !== null && factoryManagerService !== undefined) {
            var pervm = factoryManagerService.getObject("pervm");
            var busvm = factoryManagerService.getObject("busvm");
            if (pervm !== null && pervm !== undefined) {
                $scope.calcvatvm = pervm;
                $scope.calcvatvm.StartPeriod = new Date(pervm.StartPeriod);
                $scope.calcvatvm.EndPeriod = new Date(pervm.EndPeriod);
            }
            if (busvm !== null && busvm !== undefined) {
                $scope.calcvatvm.VATRate = busvm.VATRate;

            }
            $scope.calcvatvmresponse = {
                "TotalWorkingDay": "",
                "GrossExcludingVAT": "",
                "GrossIncludingVAT": "",
                "TotalVAT": "",
                "VATRate": ""
            };
            $ionicModal.fromTemplateUrl('calcvatresponseModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function () {
                $scope.modal.show();
            };

            $scope.closeModal = function () {
                $scope.modal.hide();
            };

            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
            });

            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });
            $scope.Submit = function (isValid) {
                if (isValid) {
                    $http({
                        method: 'POST',
                        url: config.apiUrl + "/CaliculateVAT",   //"http://asadev-api.azurewebsites.net/api/submission",
                        dataType: 'json',
                        data: {
                            CalcVATViewModel: $scope.calcvatvm
                        },
                        headers: { 'Content-Type': 'application/json' }

                    })
                        .success(function (resp) {
                            if (resp !== null && resp !== undefined) {
                                $scope.calcvatvmresponse = resp;
                                $scope.openModal();
                            }
                        })
                }
            }
        }

    }])
    .controller('SubmissionsCtrl', ['$scope', 'factoryManagerService', 'submissionService', function ($scope, factoryManagerService, submissionService) {
        $scope.submissions = [];
        var localbus = factoryManagerService.getObject("busVM");
        if (localbus !== null && localbus !== undefined) {
            var businessId = localbus.BusinessId;
            if (businessId !== null && businessId !== undefined) {
                submissionService.list(businessId).then(function(response) {
                    $scope.submissions = response;
                });
                //var sub = submissionService.list(businessId).then()
                //console.log(JSON.stringify(sub));
            };
        }
        $scope.getSubmissionById = function (PeriodId) {
            var successResponse = submissionService.find(PeriodId);            
           // console.log(JSON.stringify(successResponse));
        };

    }])
    .controller('SubmissionDetailCtrl', ['$scope', 'successResponse', 'factoryManagerService', '$http', '$ionicPopup', 'config', function ($scope, successResponse, factoryManagerService, $http,$ionicPopup, config) {
        $scope.response = successResponse;
        var localbus = factoryManagerService.getObject("busvm");
        if (localbus.Sender !== null && localbus.Sender !== undefined) {
            var sen = localbus.Sender;
            if (sen !== null && sen !== undefined) {
                var senEmail = sen.Email;
            }
        };
        
        $scope.generatePDF = function () {
            // $scope.startSpin();
            var pdf = new jsPDF('p', 'pt', 'a4');//'p', 'pt', 'a4'
            pdf.addHTML(document.getElementById('exportthis'), function () {
                var pdfString = pdf.output('datauristring');
                // var testtemp = getUrl();

                var postData = pdfString.replace(/^data:application\/(png|jpg|pdf);base64,/, "");
                $http({
                    method: 'POST',
                    url: config.apiUrl + "/Export",
                    dataType: 'json',
                    data: {
                        imgData: postData,
                        To: senEmail
                    },
                    headers: { 'Content-Type': "application/json" }
                })
                    .success(function (res) {
                        //$scope.stopSpin();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'Exported and sent as an attachment to the registed email, Please check you email, Thank you!'
                        })
                    })
                    .error(function (resp) {
                        //$scope.stopSpin();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Internal Server Error!',
                            template: 'Please try again!'
                        });
                    })
            });
        };
    }])
    .controller('ReturnsTabCtrl', ['$scope', 'factoryManagerService', 'busFactory', 'asaApp', '$filter', '$http', 'Constants', 'utilsFactory', '$rootScope', '$ionicPopup', '$ionicModal', 'usSpinnerService', '$state', 'config', function ($scope, factoryManagerService, busFactory, asaApp, $filter, $http, Constants, utilsFactory, $rootScope, $ionicPopup, $ionicModal, usSpinnerService, $state, config) {
        var localbus = factoryManagerService.getObject("busVM");
        var busVM = {};
        var email = "";
        $scope.periodvm = {};
        $scope.$on('$ionicView.loaded', function () {
            $scope.modes = [{ name: "testInLive", id: 1 }, { name: "Live", id: 0 }];
            if (localbus.Sender !== null && localbus.Sender !== undefined) {
                var sen = localbus.Sender;
                if (localbus.BusinessId !== null && localbus.BusinessId !== undefined)
                {
                    //get updated business model from DB via API request
                    busFactory.getBusinessById(localbus.BusinessId).then(function (response) {
                        if (response) {
                            var temp = null;
                            var data = response.data;
                            if (data !== null && data !== undefined) {
                                busVM = data;
                                if (busVM.Sender !== null && busVM.Sender !== undefined) {
                                    email = busVM.Sender.Email;
                                }
                                if (busVM.NextQuaterStartDate !== null && busVM.NextQuaterStartDate !== undefined) {
                                    $scope.periodvm.StartPeriod = new Date(busVM.NextQuaterStartDate);
                                    $scope.periodvm.EndPeriod = new Date(busVM.NextQuaterEndDate);
                                    $scope.periodvm.PeriodRefId = $filter('date')($scope.periodvm.EndPeriod, "yyyy-MM");
                                    temp = $scope.periodvm.PeriodRefId;
                                }
                                if (busVM.Periods) {                                    
                                    if (temp !== null) {                                        
                                        for (var i = 0; i < busVM.Periods.length; i++) {
                                            if (busVM.Periods[i].PeriodRefId === temp) {
                                                $scope.periodvm.PeriodId = busVM.Periods[i].PeriodId;
                                                console.log("periodId " + JSON.stringify($scope.periodvm.PeriodId));
                                            };
                                        };
                                    }
                                    factoryManagerService.set("periodlist", JSON.stringify(busVM.Periods));
                                    $scope.controllerFunction = function (valueFromDirective) {
                                        console.log("valueFromDirective" + valueFromDirective);
                                        if (valueFromDirective) {
                                            var tempDate = new Date(valueFromDirective);
                                            $scope.periodvm.PeriodRefId = $filter('date')(tempDate, "yyyy-MM");
                                            if (valueFromDirective !== busVM.NextQuaterEndDate) {
                                                // new period selected by client so set the Id to 0
                                                $scope.periodvm.PeriodId = 0; 
                                            }
                                        };                                        
                                    };
                                }
                            }                            
                        }
                    }, function (erorr) {
                        console.log("Internal Server Error");
                        $ionicPopup.alert({
                            scope: $scope,
                            content: '<span>Internal Server Error, Please try again.</span>',
                            title: 'Warning'
                        });
                    });                   
                }
            }
            else {
                      $ionicPopup.alert({
                                    scope: $scope,
                                    content: '<span>Please complete MyCompanies section via settings before any VAT submissions.</span>',
                                    title: 'Warning'
                                });
                      };
            if (asaApp !== null && asaApp !== undefined) {
                var isExp = asaApp.istrailPeriodExpired();
                if (isExp === true) {
                    $ionicPopup.alert({
                        scope: $scope,
                        content: '<span>Trail period expired, please download pro version from apple or google store.</span>',
                        title: 'Status'
                    });
                    $state.go('menu.tabs.dashboard', {}, { reload: true, notify: true });
                }

            };           
        });
        $scope.checkUserRole = function () {
            //if (busVM.Sender !== null && busVM.Sender !== undefined) {
            //    var email = busVM.Sender.Email;
            if (email !== null && email !== undefined && email !== "") {
                if ((email.toLowerCase() === "asasoftwaresolutions@outlook.com") || (email.toLowerCase() === "asavattest@gmail.com")) {
                    return true;
                }
                return false;
            }
            //}
            else { return false; }
        };
        $scope.vatvm = {};
        $scope.$watch('vatvm.VATDueOnOutputs + vatvm.VATDueOnECAcquisitions', function (value) {
            $scope.vatvm.TotalVAT = value;
            $scope.vatvm.LastUpdated = new Date();
        });
   
        $scope.mode = {};
        $scope.loading = false;
        $scope.startcounter = 0;
        $scope.startSpin = function () {
            if (!$scope.spinneractive) {
                usSpinnerService.spin('spinner-1');
                $scope.startcounter++;
            }
        };

        $scope.stopSpin = function () {
            if ($scope.spinneractive) {
                usSpinnerService.stop('spinner-1');
            }
        };
        $scope.spinneractive = false;

        $rootScope.$on('us-spinner:spin', function (event, key) {
            $scope.spinneractive = true;
        });

        $rootScope.$on('us-spinner:stop', function (event, key) {
            $scope.spinneractive = false;
        });        
        //var busvm = factoryManagerService.getObject("busvm");
        //var senvm = factoryManagerService.getObject("senvm");
        //var addvm = factoryManagerService.getObject("addvm");
        //var pervm = factoryManagerService.getObject("pervm");      
        //console.log("beforeperiodvm" + JSON.stringify(pervm));
        //if (busVM.NextQuaterStartDate !== null && busVM.NextQuaterStartDate !== undefined) {            
        //        $scope.periodvm.StartPeriod = new Date(busVM.NextQuaterStartDate);
        //        $scope.periodvm.EndPeriod = new Date(busVM.NextQuaterEndDate);
        //        $scope.periodvm.PeriodRefId = $filter('date')($scope.periodvm.StartPeriod, "yyyy-MM");
            
        //    //$scope.periodvm = pervm;//uncommented out 20/07/2017
           
        //    //$scope.periodvm.StartPeriod = new Date(pervm.StartPeriod);
        //    //$scope.periodvm.EndPeriod = new Date(pervm.EndPeriod);
        //    //$scope.periodvm.periodId = $filter('date')($scope.periodvm.StartPeriod, "yyyy-MM"); //load default value 
           
        //    $scope.controllerFunction = function (valueFromDirective) {
        //        console.log(valueFromDirective);
        //        var tempdate = new Date(valueFromDirective);
        //        console.log("fromview" + $filter('date')(tempdate, "yyyy-MM"));

        //        $scope.periodvm.periodId = $filter('date')(tempdate, "yyyy-MM");
        //    };
        //}
        //else {
        //    console.log("load view with empty fields");
        //    var temp;
        //    $scope.controllerFunction = function (valueFromDirective) {
        //        //console.log(valueFromDirective);
        //        var tempdate = new Date(valueFromDirective);
        //        //console.log("fromview" + $filter('date')(tempdate, "yyyy-MM"));

        //        temp = $filter('date')(tempdate, "yyyy-MM");
        //    }
        //    $scope.periodvm = {
        //        StartPeriod: '',
        //        EndPeriod: '',
        //        PeriodRefId: temp
        //    };

        //}
        ////console.log("periodvm" + JSON.stringify($scope.periodvm));
        ////console.log("rootscopetest" + $rootScope.periodList);
        var getMode = function () {
            if ($scope.mode.selectedMode === null || $scope.mode.selectedMode === undefined) {
                return "0";
            }
            else {
                return $scope.mode.selectedMode.id;
            }
        };
        $scope.Submit = function (isValid) {
            if (isValid) {
                var subVM = {
                    BussinessViewModel: busVM,
                    VAT100ViewModel: $scope.vatvm,
                    PeriodViewModel: $scope.periodvm,
                    RunMode: getMode()
                };
                $scope.startSpin();

                $http({
                    method: 'POST',
                    url: config.apiUrl + "/submission",   // "http://asadev-api.azurewebsites.net/api/submission",
                    dataType: 'json',
                    data: subVM,//{
                       // VAT100ViewModel: $scope.vatvm,
                        //PeriodViewModel: $scope.periodvm,
                        //BusinessViewModel: bus,
                        //AddressViewModel: addvm,
                        //SenderViewModel: senvm,
                        //Runmode: getMode()

                    //},
                   headers: { 'Content-Type': 'application/json' }
                    //,params: { busStr: angular.toJson($scope.businessvm, false) }
                })
                    .success(function (resp) {
                        if (resp.Errors.length > 0) {
                            $scope.errors = [];
                            for (var e = 0; e < resp.Errors.length; e++) {
                                var eitem = resp.Errors[e];
                                $scope.errors.push(eitem.Error.Text);

                            }
                            $scope.stopSpin();
                            $ionicPopup.alert({
                                scope: $scope,
                                template:
                                //'<textarea rows="6" ng-repeat="error in errors track by $index">{{error}}</textarea>                              ',
                                '<ion-list>                                ' +
                                '  <ion-item class="item-text-wrap" ng-repeat="error in errors track by $index"> ' +
                                '    {{error}}                              ' +
                                '  </ion-item>                             ' +
                                '</ion-list>                               ',
                                title: 'Errors'
                            });
                        }
                        else {
                            $scope.ExtractData(resp.hmrcResponse, resp.vatPeriod, resp.paymentDetails);

                        }

                        //$scope.modal.show();
                        //$scope.modalInstance = $ionicModal.open({
                        //    templateUrl: 'myModalContent.html',
                        //    controller: 'ReturnsTabCtrl',
                        //    resolve: {
                        //        response: function () {
                        //            return resp.hmrcResponse;
                        //        },
                        //        paymentDetails: function () {
                        //            return resp.paymentDetails;
                        //        }
                        //    }
                        //})
                        //$scope.showPopup();
                        //check if the new pervm object has status property after set in local storage  
                        //update start and end dates here 
                        //    for (var i = 0; i < pervm.length; i++) {
                        //        if (StartDate === persons[i].name) {  //look for match with name
                        //            pervm[i].StartDate = new Date(pervm[i].StartDate.getMonth()+3);  //add two
                        //            break;  //exit loop since you found the person
                        //        }
                        //    }
                        //    localStorage.setItem("pvm", JSON.stringify(pvm));  //put the object back
                        //}

                    })
                    .error(function (resp) {
                        $scope.stopSpin();
                        $ionicPopup.alert({
                            scope: $scope,
                            content: '<span>Internal Server Error - 500 </br>Please try again</span>',
                            title: 'Status'
                        });

                        //console.log("internal server error");
                    });
            }
        }

        $scope.ExtractData = function (hrespone, hperiod, hpayment) {
            //var responses = [];
            //angular.forEach(hrespone, function (value, key) {
            //    //console.log(value);
            //    //console.log(key);
            //    responses.push(hrespone[key]);
            //});
            var paymentInfo = {
                "InformationNotification": "",
                "PaymentDuedate": "",
                "PaymentNotification": "",
                "ReceiptTimeStamp": "",
                "VATDeclarationReference": ""
            };
            var periodInfo = {
                "PeriodId": "",
                "PeriodStartDate": "",
                "PeriodEndDate": ""
            };
            //var messageInfo = {
            //    "code": ""
            var TotalGross = $scope.vatvm.NetSalesAndOutputs;
            //};

            var items = []; var payitems = [];
            $scope.subitems = []; $scope.subpayitems = [];
            $scope.hmrcresponses = [];
            //angular.forEach(hrespone, function (message) {
            //    angular.forEach(message.Message, function (submessage) {
            //        $scope.submark.push(submessage)
            //    });
            //});          
            for (var i = 0; i < hrespone.length; i++) {
                var data = hrespone[i];
                //messageInfo = data;
                // console.log("messageinfo" + messageInfo.code);
                items.push(data); //push messageInfo instead of data
            }
            for (j = 0; j < items.length; j++) {
                var temp = items[j];
                $scope.subitems.push(temp['q1:Message']);
            }
            for (var k = 0; k < $scope.subitems.length; k++) {
                var temp2 = $scope.subitems[k];
                $scope.hmrcresponses.push(temp2['#text']);
                console.log(temp2['#text']);
            }
            //<textarea rows="4">{{item.text}}</textarea>
            //console.log(responses);
            for (var n = 0; n < hperiod.length; n++) {
                var periodData = hperiod[n];
                //perioditems.push(data);
                periodInfo = periodData;
            }

            //read pay stuff here
            for (var m = 0; m < hpayment.length; m++) {
                var paymentData = hpayment[m];
                payitems.push(paymentData);
            }

            for (j = 0; j < payitems.length; j++) {
                var tempv = payitems[j];
                $scope.subpayitems.push(tempv['Body']);
                paymentInfo = tempv['Body'];
                paymentInfo.TotalSalesGross = TotalGross;
                if ($scope.hmrcresponses.length > 0) {
                    for (var f = 0; f < $scope.hmrcresponses.length; f++) {
                        var hitem = $scope.hmrcresponses[f];
                        if (hitem.indexOf("IRmark") !== -1) {
                            //exist 
                            paymentInfo.IRMark = hitem;
                        }
                    }
                }
                //start comment out as the data store is SQL not local 
                //var strsubList = factoryManagerService.get("submissionlist");
                //if (strsubList !== null && strsubList !== undefined) {
                //    var sublist = JSON.parse(strsubList);
                //    if (sublist !== null && sublist !== undefined) {
                //        sublist.push({ id: periodInfo.VATPeriod.PeriodId.toString(), value: paymentInfo });
                //        localStorage.setItem("submissionlist", JSON.stringify(sublist));
                //    }
                //}
                //else {

                //    $rootScope.submissionList.push({ id: periodInfo.VATPeriod.PeriodId.toString(), value: paymentInfo });
                //    factoryManagerService.set("submissionlist", JSON.stringify($rootScope.submissionList));
                //}
            }
            //$scope.periodvm.status = Constants.Status[4]; //add status and push into array 
            //var strpdata = factoryManagerService.get("periodlist"); //localStorage.getItem("periodlist");
            //if (strpdata !== null && strpdata !== undefined) {
            //    var pdata = JSON.parse(strpdata);
            //}
            ////should be arrayList pdata
            //if (pdata !== null && pdata !== undefined) {
            //    pdata.push($scope.periodvm); //if its array then push new item into it 
            //    factoryManagerService.set("periodlist", JSON.stringify(pdata));//localStorage.setItem("periodlist", JSON.stringify(pdata)); //save it back in the local storage 
            //}
            //else {
            //    $rootScope.periodList.push($scope.periodvm);//push item in global array list
            //    factoryManagerService.set("periodlist", JSON.stringify($rootScope.periodList));//localStorage.setItem("periodlist", JSON.stringify($rootScope.periodList));//then save item in local storage
            //}

            //end comment out as the data store is SQL not local

            $scope.stopSpin();
            $ionicPopup.alert({
                scope: $scope,//'<textarea rows="5" ng-repeat="response in hmrcresponses track by $index">{{response}}</textarea>',
                template: '<ion-list>                                ' +
                '  <ion-item class="item-text-wrap" style="font-size: 10px" ng-repeat="response in hmrcresponses track by $index"> ' +
                '    {{response}}                              ' +
                '  </ion-item>                             ' +
                '</ion-list>                               ',

                title: 'HMRC Response',
                buttons: [{ text: 'OK' }]
            }).then(function (res) {
                  //comment out as the data store is SQL not local

                //pervm.StartPeriod = utilsFactory.addMonths(pervm.StartPeriod, 3);//add new pervm with next quater details and save in locla storage 
                //pervm.EndPeriod = utilsFactory.addMonths(pervm.EndPeriod, 3);
                //pervm.periodId = $filter('date')(pervm.StartPeriod, "yyyy-MM");
                //pervm.status = '';
                //factoryManagerService.set("pervm", JSON.stringify(pervm));//localStorage.setItem("pervm", JSON.stringify(pervm));
                
                //$state.go('menu.tabs.dashboard', null, { reload: true, notify: true });

                history.back();
            });
        }       
    }])
    .controller('businessCtrl', ['$scope', 'factoryManagerService', 'busFactory', 'busService', function ($scope, factoryManagerService, busFactory, busService) {
        //  getBusiness();
        var busvm = factoryManagerService.getObject("busVM");
        if (busvm !== null && busvm !== undefined && busvm !== '') {
            if (busvm.Sender !== null && busvm.Sender !== undefined) {
                var senderId = busvm.Sender.SenderId.toString();
                if (senderId !== null && senderId !== undefined) {
                    getBusiness(senderId);
                }
            }
        };
        function getBusiness(senderId) {
            busFactory.getBussiness(senderId).then(function (response) {
                if (response.data !== null && response.data !== undefined) {
                    $scope.bussinesses = response.data;
                };
            }, function (error) {
                console.log("error from server");
            });
        };
        $scope.getBusinessById = function (Id) {
            var busVM = busService.getBusinessById(Id);
            console.log("busVM from bussCtrl " + JSON.stringify(busVM));
        };
    }])
    .controller('addbusinessCtrl', ['$scope', '$filter', 'busVM', 'busFactory', 'factoryManagerService', function ($scope, $filter, busVM, busFactory, factoryManagerService) {
        $scope.businessvm = {};
        $scope.addressvm = {};
        $scope.sendervm = {};
         $scope.periodvm = {};
         
        //coomented out due to period refId not required in this context
         $scope.$watch('businessvm.NextQuaterStartDate', function (value) {
             $scope.periodvm.StartPeriod = new Date($scope.businessvm.NextQuaterStartDate);// $filter('date')(value, "yyyy-MM");
             $scope.periodvm.PeriodRefId = $filter('date')($scope.businessvm.NextQuaterStartDate, "yyyy-MM");
         });
         $scope.$watch('businessvm.NextQuaterEndDate', function (value) {
             $scope.periodvm.EndPeriod = new Date($scope.businessvm.NextQuaterEndDate);

         });

        $scope.Submit = function (isValid) {
            if (isValid) {
                try {
                    var busVM = {
                        BusinessName: $scope.businessvm.BusinessName,
                        RegisteredDate: $scope.businessvm.RegisteredDate,
                        TradingName: $scope.businessvm.TradingName,
                        VATRegNo: $scope.businessvm.VATRegNo,
                        VATRate: $scope.businessvm.VATRate,
                        NextQuaterStartDate: $scope.businessvm.NextQuaterStartDate,
                        NextQuaterEndDate: $scope.businessvm.NextQuaterEndDate,
                        RegNo: $scope.businessvm.RegNo,
                        BusinessAddress: $scope.addressvm,
                        Sender: $scope.sendervm,
                        Period: $scope.periodvm                        
                    };
                    console.log("busvm" + JSON.stringify(busVM));
                    busFactory.insertBusinessData(busVM).then(function (response) {
                        var data = response.data;
                        var busId = data.split(",")[0];
                        var senId = data.split(",")[1];
                        busVM.BusinessId = parseInt(busId);
                        busVM.SenderId = parseInt(senId);
                        busVM.Sender.SenderId = parseInt(senId);
                        factoryManagerService.set("busVM", JSON.stringify(busVM));
                        history.back();
                    }, function (error) {
                        console.log("Server Error");
                    });
                }
                catch (exception) {
                    console.log(exception.message);
                }
            }
        };
    }])
    //businessdetails
    .controller('businessdetailCtrl', ['$scope', 'busVM', '$ionicPopup', 'busFactory', 'factoryManagerService', function ($scope, busVM, $ionicPopup, busFactory, factoryManagerService) {
        $scope.showPopup = function () {
            $ionicPopup.alert({
                title: 'Profile',
                content: 'updated sucessfully!'
            });
        };
        //console.log("busVM " + JSON.stringify(busVM));        
        $scope.busVM = busVM;
        //$scope.periovm = busVM.
        //$scope.$watch('busVM.NextQuaterStartDate', function (value) {
        //    $scope.periodvm.StartPeriod = new Date($scope.busVM.NextQuaterStartDate);// $filter('date')(value, "yyyy-MM");
        //    $scope.periodvm.PeriodRefId = $filter('date')($scope.busVM.NextQuaterEndDate, "yyyy-MM");
        //});
        //$scope.$watch('businessvm.NextQuaterEndDate', function (value) {
        //    $scope.periodvm.EndPeriod = new Date($scope.busVM.NextQuaterEndDate);
        //});

        $scope.Submit = function (isValid) {
            if (isValid) {
                var updatebusVM = {
                    BusinessId: $scope.busVM.BusinessId,
                    BusinessName: $scope.busVM.BusinessName,
                    RegisteredDate: $scope.busVM.RegisteredDate,
                    TradingName: $scope.busVM.TradingName,
                    VATRegNo: $scope.busVM.VATRegNo,
                    VATRate: $scope.busVM.VATRate,
                    NextQuaterStartDate: $scope.busVM.NextQuaterStartDate,
                    NextQuaterEndDate: $scope.busVM.NextQuaterEndDate,
                    RegNo: $scope.busVM.RegNo,
                    BusinessAddress: $scope.busVM.BusinessAddress,
                    Sender: $scope.busVM.Sender//,
                    //Period: $scope.busVM.Period
                };
                console.log("updatebusvm" + JSON.stringify(updatebusVM));
                busFactory.updateBusinessData(updatebusVM).then(function (response) {
                    factoryManagerService.set("busVM", JSON.stringify(updatebusVM));
                    history.back();
                }, function (error) {
                    $ionicPopup.alert({
                        title: error.data.Message,
                        content: error.data.MessageDetail
                    });
                });
            };
        }
    }])
    .controller('busCtrl', ['$scope', 'factoryManagerService', '$filter', '$rootScope', '$ionicPopup', function ($scope, factoryManagerService, $filter, $rootScope, $ionicPopup, $ionicModal) {
        //var localdata = localStorage.get("bsprofile");
        $scope.showPopup = function () {
            $ionicPopup.alert({
                title: 'Profile',
                content: 'updated sucessfully!'
            });
        }
        //var pervm = {}

        //var busvm = localStorage.getItem("busvm");
        //var addvm = localStorage.getItem("addvm");
        //    var senvm = localStorage.getItem("senvm");
        //var pervm = localStorage.getItem("pervm");//read from globalarraylist 
        //var pervmObjsListStr = localStorage.getItem("periodlist"); //read from local storage 
        //if (pervmObjsListStr !== null) {
        //    var pervmObjsList = JSON.parse(pervmObjsListStr);
        //    var pervmObj = pervmObjsList[pervmObjsList.length - 1]; //get latest one 
        //    console.log("perObj" + JSON.stringify(pervmObj));
        //}
        //if (pervmObj !== undefined && pervmObj !== null && pervmObj.length > 0) {
        //    var pervm = JSON.parse(pervmObj);
        //    console.log("pervm" + JSON.stringify(pervm));
        //}

        //console.log("from factory Obj:" + $localstorage.getObject('pervm'));
        //console.log("permodel" + JSON.stringify(pervm));
        //console.log("busmodel" + JSON.stringify(busvm));
        //console.log("senmodel" + JSON.stringify(senvm));
        //console.log("addmodel" + JSON.stringify(addvm));
        if (factoryManagerService !== null && factoryManagerService !== undefined) {
            var bus = factoryManagerService.getObject("busvm");
            var add = factoryManagerService.getObject("addvm");
            var sen = factoryManagerService.getObject("senvm");
            var period = factoryManagerService.getObject("pervm");

            if (bus !== null && bus !== undefined) {
                $scope.businessvm = bus
                //var busvmObj = JSON.parse(busvm);
                $scope.businessvm.RegisteredDate = new Date(bus.RegisteredDate);
            } else { $scope.businessvm = {}; }
            if (sen !== undefined && sen !== null) {
                $scope.sendervm = sen;
            } else { $scope.sendervm = {}; }
            if (add !== null && add !== undefined) { $scope.addressvm = add; } else { $scope.addressvm = {}; }
            if (period !== undefined && period !== null) {
                $scope.periodvm = period;
                //var pObj = JSON.parse(p);
                $scope.periodvm.StartPeriod = new Date(period.StartPeriod);
                $scope.periodvm.EndPeriod = new Date(period.EndPeriod);
            } else { $scope.periodvm = {}; }
        }

        else {
            console.log("load view with empty fields");
            $scope.businessvm = {};
            $scope.addressvm = {};
            $scope.sendervm = {};
            $scope.periodvm = {};
        }
        //if (addvm !== null && addvm !== undefined) {
        //    var add = factoryManagerService.getObject("addvm");

        //    $scope.addressvm = add;
        //}
        //else
        //{
        //    console.log("load view with empty fields");
        //    $scope.addressvm = {};
        //}

        //if (senvm !== null && senvm !== undefined) {
        //    var sen = factoryManagerService.getObject("senvm");
        //    $scope.sendervm = sen;
        //}
        //else {
        //    console.log("load view with empty fields");
        //    $scope.sendervm = {};
        //}

        //if (pervm !== null && pervm !== undefined) {
        //    var period = factoryManagerService.getObject("pervm");
        //    $scope.periodvm = period;
        //    //var pObj = JSON.parse(p);
        //    $scope.periodvm.StartPeriod = new Date(period.StartPeriod);
        //    $scope.periodvm.EndPeriod = new Date(period.EndPeriod);

        //    //$scope.periodvm = pervm; //20/07/2017
        //    //var pervmObj = JSON.parse(pervm);

        //   // $scope.periodvm.StartPeriod = new Date(pervm.StartPeriod);
        //    //$scope.periodvm.EndPeriod = new Date(pervm.EndPeriod);
        //    // $scope.periodvm.TaxQuater = pervmObj.TaxQuater;
        //    // $scope.periodvm.periodId = pervmObj.periodId;
        //    //$scope.periodvm.periodId = $filter('date')($scope.periodvm.StartPeriod, "yyyy-MM");
        //}
        //else
        //{
        //    console.log("load view with empty fields");
        //    $scope.periodvm = {};
        //    //item.dateAsString = $filter('date')(item.date, "yyyy-MM-dd");
        //    //$scope.periodvm.periodId = $filter('date')($scope.periodvm.StartPeriod, "yyyy-MM");
        //}
        $scope.Save = function (isValid) {
            if (isValid) {
                try {

                    //localStorage.setItem("busvm", JSON.stringify($scope.businessvm));
                    //localStorage.setItem("addvm", JSON.stringify($scope.addressvm));
                    //localStorage.setItem("senvm", JSON.stringify($scope.sendervm));
                    $scope.periodvm.periodId = $filter('date')($scope.periodvm.StartPeriod, "yyyy-MM");
                    // localStorage.setItem("pervm", JSON.stringify($scope.periodvm));
                    //$localstorage.setObject("pervm", $scope.periodvm);//commented out 20/07/2017
                    factoryManagerService.setObject("pervm", $scope.periodvm);
                    factoryManagerService.setObject("senvm", $scope.sendervm);
                    factoryManagerService.setObject("busvm", $scope.businessvm);
                    factoryManagerService.setObject("addvm", $scope.addressvm);


                    //$rootScope.periodList.push("peroidlist", JSON.stringify($scope.periodvm));
                    //localStorage.setItem("periodlist", JSON.stringify($rootScope.globalPeriodList));
                    //console.log('saved profile to local storage');
                    $scope.showPopup();
                }
                catch (exception) {
                    console.log(exception.message);
                }
                /* $http({
                    method: 'POST',
                    url: "http://localhost:55934/api/business",
                    dataType: 'json',
                    data: {
                        businessvm: $scope.businessvm,
                        addressvm: $scope.addressvm,
                        sendervm: $scope.sendervm
                    },
                    headers: { 'Content-Type': 'application/json' }
                    //,params: { busStr: angular.toJson($scope.businessvm, false) }
                })
              .success(function (resp) {
                  if (resp.errors) {
                      console.log(resp.errors.name)
                  } else {
                      console.log(resp);
                      window.localStorage.setItem("bsprofile", JSON.stringify(resp));
                  }
        
              })*/
            }
        }
    }])
    .controller('clientsCtrl', ['$scope', 'clientFactory', 'factoryManagerService', 'clientVM', function ($scope, clientFactory, factoryManagerService, clientVM) {
        $scope.clients = [];
        $scope.status;
        $scope.client = {};
        $scope.clientAdd = {};

        $scope.$on('$ionicView.beforeEnter', function () {
            getClients();
        });

        function getClients() {
            clientFactory.getClients()
                .then(function (response) {
                    $scope.clients = response.data;
                    clientFactory.clientlist = response.data;
                    //clientVM.Id = response.data.Id;
                    clientVM = response.data;
                    var clientsArry = [];
                    for (var cl = 0; cl < clientVM.length; cl++) {
                        clientsArry.push(clientVM[cl]);
                    }

                    factoryManagerService.set("clientsVM", JSON.stringify(clientsArry));
                    //localStorage.setItem("clientsVM", JSON.stringify(clientVM));

                }, function (error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                });
        }
        //$scope.updateClient = function (id) {
        //    var client;
        //    for (var i = 0; i < $scope.clients.length; i++) {
        //        var curClient = $scope.clients[i];
        //        if (curClient.Id === id) {
        //            client = curClient;
        //            break;
        //        }
        //    }
        //    clientFactory.updateClient(client).then(function (response) {
        //        $scope.status = 'UpdatedClient! Refreshing client list';

        //    }, function (error) {
        //        $scope.status = 'Unable to update client:' + error.message;
        //    });
        //};
        //$scope.insertClient = function () {
        //    var clientAdd = {
        //        Line1: $scope.clientAdd.Line1,
        //        Line2: $scope.clientAdd.Line2,
        //        Line3:  $scope.clientAdd.Line3,
        //        City: $scope.clientAdd.City,
        //        Country: $scope.clientAdd.Country
        //    };
        //    var client = {
        //        name: $scope.client.Name,
        //        RegNo: $scope.client.RegNo,
        //        VATNo: $scope.client.VATNo,
        //        Address: clientAdd
        //    };
        //    clientFactory.insertClient(client).then(function (response) {
        //        $scope.status = 'Inserted client! Refreshing list';
        //        $scope.clients.push(client);
        //    }, function (error) {
        //        $scope.status = 'Unable to update client: ' + error.message;
        //    });
        //};

        $scope.getClientById = function (id) {
            console.log(id);
            var clientVM = clientFactory.find(id);//clientFactory.getClientById(id);

        };
    }])
    .controller('addClientCtrl', ['$scope', 'factoryManagerService', '$ionicPopup', 'clientFactory', '$state', function ($scope, factoryManagerService, $ionicPopup, clientFactory, $state) {
        $scope.client = {};
        $scope.clientAdd = {};
        $scope.client.BusinessId = null;
        $scope.$on('$ionicView.beforeEnter', function () {
            var busVMStr = factoryManagerService.get("busVM");
            if (busVMStr !== null && busVMStr !== undefined && busVMStr !== "") {
                var busVM = JSON.parse(busVMStr);
                if (busVM !== "") {
                    $scope.client.BusinessId = busVM.BusinessId;
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Warning!',
                        template: 'Please complete business details, via MyCompanies settings'
                    });
                }

            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Warning!',
                    template: 'Please complete business details, via MyCompanies settings'
                });
            }
        });
        $scope.Submit = function (isValid) {
            var clientAdd = $scope.clientAdd;
            var client = {
                name: $scope.client.Name,
                RegNo: $scope.client.RegNo,
                VATNo: $scope.client.VATNo,
                Address: clientAdd,
                BusinessId: $scope.client.BusinessId
            };
            clientFactory.insertClient(client).then(function (response) {
                $state.go('menu.clients');
            }, function (error) {
                $scope.status = 'Unable to add client: ' + error.message;
            });
        };
    }])
    .controller('clientDetailCtrl', ['$scope', 'clientVM', 'clientFactory', '$state', function ($scope, clientVM, clientFactory, $state) {
        $scope.clientVM = clientVM;

        $scope.updateClient = function () {
            clientFactory.updateClient($scope.clientVM).then(function (response) {
                console.log("sucessfully updated client");
                $state.go('menu.clients');
            }, function (error) {
                console.log("unable to update client");
            });
        }
    }])
    .controller('invoiceCtrl', ['$scope', 'factoryManagerService', 'invoiceFactory', 'clientFactory', 'invoiceView', 'invoiceService', function ($scope, factoryManagerService, invoiceFactory, clientFactory, invoiceView, invoiceService) {
        $scope.invoices = [];
        $scope.invoices.length = 0;
        var businessId = 0; 
        var localbus = factoryManagerService.getObject("busVM");
        if (localbus !== null && localbus !== undefined) {
            businessId = localbus.BusinessId;
            if (businessId !== null && businessId !== undefined) {
                invoiceService.getInvoices(businessId).then(function (invoices) {
                    $scope.invoices = invoices;
                });             
            };
        };
        // var invoiceslst = invoiceService.getInvoices();
        //invoiceFactory.getInvoices(businessId).then(function (response) {
        //    angular.forEach(response.data, function (invoice) {
        //        invoiceVM = {};
        //        var clientVM = clientFactory.find(invoice.ClientId);
        //        if (clientVM !== null && clientVM !== undefined) {
        //            invoiceVM.Id = invoice.Id;
        //            invoiceVM.ClientName = clientVM.Name;
        //            invoiceVM.Number = invoice.Details.No;
        //            invoiceVM.Total = invoice.Total;
        //            invoiceVM.DueDate = invoice.Details.DueDate;
        //            $scope.invoices.push(invoiceVM);
        //            console.log("invoices " + JSON.stringify($scope.invoices));
        //        };

        //    });
        //}, function (error) {
        //    console.log("invoicesCtrl:-> unable to found businessId plesae update business details in settings" );
        //});
        $scope.getInvoiceId = function (Id) {
            var invoiceView = invoiceService.getInvoiceById(Id);
            console.log("invoiceview" + JSON.stringify(invoiceView));
        }
    }])
    .controller('invoiceviewCtrl', ['$scope', 'invoiceView', 'invoiceitems', 'invoicedetailVM', function ($scope, invoiceView, invoiceitems, invoicedetailVM) {
        $scope.invoiceView = invoiceView;

    }])
    .controller('editinvoiceCtrl', ['$scope', 'factoryManagerService', 'clientFactory', 'invoiceService', 'invoiceitems', '$ionicPopup', 'invoiceFactory', '$state', '$ionicPlatform', function ($scope, factoryManagerService, clientFactory, invoiceService, invoiceitems, $ionicPopup, invoiceFactory, $state, $ionicPlatform) {
        var invoiceVMStr = factoryManagerService.get("invoiceVM", JSON.stringify(invoiceVM));
        //console.log("invoiceVM " + JSON.stringify(invoiceVMStr));
        if (invoiceVMStr !== null && invoiceVMStr !== undefined) {
            var invoiceVM = JSON.parse(invoiceVMStr);
        }
        //define
        var selectedClient = {};
        var invDetails = {};
        $scope.invitems = [];
        $scope.invitems.length = 0;
        //populate
        var clientVM = clientFactory.find(invoiceVM.ClientId);
        if (clientVM !== null && clientVM !== undefined) {
            selectedClient = clientVM;
            $scope.selectedClientName = selectedClient.Name;
        }

        if (invoiceVM.Items.length > 0) {
            $scope.invitems = invoiceVM.Items;
            invoiceitems.list = invoiceVM.Items; //populate factory with local storage list 
            $scope.count = $scope.invitems.length;
            $scope.Subtotal = invoiceVM.Items[0].SubTotal;
            $scope.VAT = invoiceVM.Items[0].VAT;
            $scope.Total = invoiceVM.Items[0].Total;
        }
        else {
            $scope.invitems = invoiceitems.list;
        }
        var invoicedetailEditVM = {};
        $scope.$on('$ionicView.beforeEnter', function () {
            var subtotal = 0;
            var vat = 0;
            var total = 0;

            $scope.count = 0;
            $scope.Subtotal = 0;
            $scope.VAT = 0;
            $scope.Total = 0;
            if (($scope.invitems !== null) && ($scope.invitems !== undefined) && $scope.invitems.length > 0) {
                angular.forEach($scope.invitems, function (v) {
                    subtotal = parseFloat(subtotal) + parseFloat(v.SubTotal);
                    vat = parseFloat(vat) + parseFloat(v.VAT);
                });
                total = subtotal + vat;
                $scope.Subtotal = subtotal;
                $scope.VAT = vat;
                $scope.Total = total;
                $scope.count = $scope.invitems.length;
            }
            else {
                $scope.Subtotal = subtotal;
                $scope.VAT = vat;
                $scope.Total = total;
                $scope.count = $scope.invitems.length;
            };

            selectedClient = clientFactory.BoradcastClient();
            console.log("selected client" + JSON.stringify(selectedClient));
            if (selectedClient !== null && selectedClient !== undefined) {
                if (selectedClient.Name !== null && selectedClient.Name !== undefined) {
                    $scope.selectedClientName = selectedClient.Name;
                }
            }

        });
        if (invoiceVM.Details !== null && invoiceVM.Details !== undefined) {
            invDetail = invoiceVM.Details;
            invoicedetailEditVM = invoiceService.getInvDetailEdit(invDetail); //just parsing 
        }
        $scope.getItemId = function (itemId) {
            var item = invoiceitems.find(itemId);
        };
        $scope.confirmDelete = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Delete',
                template: 'Are you sure you want to delete this invoice?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    invoiceFactory.deleteInvoice(invoiceVM).then(function (response) {
                        history.back();
                    }, function (error) {

                    })

                } else {
                    console.log('You are not sure');
                }
            });
        };
        $scope.Update = function () {
            if (selectedClient.Id !== null && selectedClient.Id !== undefined) {
                invoiceVM.ClientId = selectedClient.Id;
                invoiceVM.Details = invoicedetailEditVM;
                invoiceVM.Items = $scope.invitems;
                invoiceVM.SubTotal = $scope.Subtotal;
                invoiceVM.VAT = $scope.VAT;
                invoiceVM.Total = $scope.Total;
            }
            else {
                //invoiceVM.ClientId = selectedClient.Id;//if client is not changed dont bother update 
                invoiceVM.Details = invoicedetailEditVM;
                invoiceVM.Items = $scope.invitems;
            }
            invoiceVM.LastUpdated = new Date(); //set the update date in the model

            invoiceFactory.updateInvoice(invoiceVM).then(function (response) {
                invoiceitems.list.length = 0; //reset factory items list to 0 
                selectedClient = null; //reset client to null 
                invoicedetailEditVM = null; //reset details to null

                $state.go('menu.tabs.invoiceview', {}, { reload: false });
                // history.back();
                //$state.go($state.current, {}, { reload: true }); 
            }, function (error) {
                console.log("error handle");
                var alertPopup = $ionicPopup.alert({
                    title: 'Internal Server Error!',
                    template: 'Please try again!'
                });
            });
        }
        $scope.$on("$ionicView.leave", function () {
            console.log("leaving");
            if ($state.current.name == "menu.tabs.invoiceview") {
                invoiceitems.list.length = 0; //reset factory items list to 0 
                selectedClient = null; //reset client to null 
                invoicedetailEditVM = null; //reset details to null
            };
        });
    }])
    .controller('createInvoiceCtrl', ['$scope', '$ionicModal', '$filter', 'clientFactory', 'invoiceService', 'invoiceitems', 'factoryManagerService', 'uuid2', '$state', '$ionicPopup', '$rootScope', function ($scope, $ionicModal, $filter, clientFactory, invoiceService, invoiceitems, factoryManagerService, uuid2, $state, $ionicPopup, $rootScope) {
        var vm = this;
        var busvm = factoryManagerService.getObject("busVM");
        if (busvm !== null && busvm !== undefined) {
            var addvm = busvm.BusinessAddress;
        };
        console.log(JSON.stringify(busvm));
        console.log(JSON.stringify(addvm));
        //invoiceitems.list.length = 0; // new item creation so clear any items in list 
        var selectedClient = {};
        var invDetails = {};

        setDefaultsForPdfViewer($scope);
        // Initialize the modal view.
        $ionicModal.fromTemplateUrl('pdf-viewer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });
        vm.createInvoice = function () {
            var invoice = getData();

            invoiceService.CreatePdf(invoice)
                .then(function (pdf) {
                    var blob = new Blob([pdf], { type: 'application/pdf' });
                    var url = URL.createObjectURL(blob);//$sce.trustAsResourceUrl(blob);

                    //$scope.pdfUrl = $sce.trustAsResourceUrl(url);
                    $scope.pdfUrl = url;
                    // Display the modal view
                    vm.modal.show();
                });
        };

        // Clean up the modal view.
        $scope.$on('$destroy', function () {
            vm.modal.remove();
        });
        function setDefaultsForPdfViewer($scope) {
            $scope.scroll = 0;
            $scope.loading = 'Loading..';

            $scope.onError = function (error) {
                console.error(error);
            };

            $scope.onLoad = function () {
                $scope.loading = '';
            };

            $scope.onProgress = function (progress) {
                console.log(progress);
            };
        }

        function getData() {
            if ((busvm !== null) && (busvm !== undefined) && addvm !== null && addvm !== undefined) {
                var fromaddress = Object.keys(addvm).map(function (k) { return addvm[k] }).join(", ");
                var toaddress = Object.keys(selectedClient.Address).map(function (k) { return selectedClient.Address[k] }).join(", ");
                var temparr = [];
                if ($scope.invitems.length > 0) {
                    angular.forEach($scope.invitems, function (v) {
                        var tempModal = { "Description": "", "Quantity": "", "Price": "" };
                        tempModal.Description = v.Description;
                        tempModal.Quantity = JSON.stringify(v.Quantity);
                        tempModal.Price = JSON.stringify(v.Price);
                        temparr.push(tempModal);
                    });
                };
                return {
                    Date: new Date().toLocaleDateString("en-IE", { year: "numeric", month: "long", day: "numeric" }),
                    AddressFrom: {
                        Name: busvm.BusinessName,
                        Address: fromaddress,
                        Country: "UK"
                    },
                    AddressTo: {
                        Name: selectedClient.Name,
                        Address: toaddress,
                        Country: "UK"
                    },
                    Detail: {
                        No: invDetails.No,
                        IssueDate: $filter('date')(invDetails.IssueDate, "dd-MM-yyyy"),
                        DueDate: $filter('date')(invDetails.DueDate, "dd-MM-yyyy")
                    },
                    Items: temparr,
                    //[
                    //    { Description: 'iPhone 6S', Quantity: '1', Price: '€700' },
                    //    { Description: 'Samsung Galaxy S6', Quantity: '2', Price: '€655' }
                    //],
                    Subtotal: JSON.stringify($scope.SubTotal),
                    VAT: JSON.stringify($scope.VAT),
                    Total: JSON.stringify($scope.Total)
                    // $scope.Subtotal
                    //$scope.VAT
                    //$scope.Total
                };

            }
            else {
                return null;
            }
        };
        $scope.invitems = [];
        $scope.invitems.length = 0;

        invDetails = invoiceService.getInvDetail();
        //$scope.invitems = invoiceitems.list;        
        console.log(JSON.stringify(invoiceitems.list));
        $scope.$on('$ionicView.beforeEnter', function () {
            console.log(JSON.stringify(invoiceitems.list));
            $scope.count = 0;
            var subtotal = 0;
            var vat = 0;
            var total = 0;
            $scope.SubTotal = 0;
            $scope.VAT = 0;
            $scope.Total = 0;

            selectedClient = clientFactory.BoradcastClient();
            console.log("selected client" + JSON.stringify(selectedClient));
            $scope.selectedClientName = selectedClient.Name;

            // console.log("invItemsLst" + JSON.stringify(invItemsLst));

            if (invoiceitems.list.length > 0) {
                $scope.invitems.length = 0; //reset to 0 and reload full array
                //$scope.invitems = invoiceitems.list; 
                //for (var i = 0; i < $scope.invitems.length; i++) {
                //    subtotal = parseFloat(subtotal) + $scope.invitems[i].SubTotal;
                //    vat = parseFloat(vat) + $scope.invitems[i].VAT;
                //}
                angular.forEach(invoiceitems.list, function (v) {
                    $scope.invitems.push(v);
                    subtotal = parseFloat(subtotal) + v.SubTotal;
                    vat = parseFloat(vat) + v.VAT;
                });
                //total = subtotal + vat;
                $scope.SubTotal = subtotal;
                $scope.VAT = vat;
                $scope.Total = $scope.SubTotal + $scope.VAT;
            }
            else {
                $scope.invitems.length = 0;
            }
            if (($scope.invitems === undefined) || ($scope.invitems.length === 0)) {
                $scope.invitems.length = 0;
                $scope.SubTotal = subtotal;
                $scope.VAT = vat;
                $scope.Total = $scope.SubTotal + $scope.VAT;
            };
            $scope.count = $scope.invitems.length;

        });
        $scope.getItemId = function (itemId) {
            //var item = invoiceService.getInvItemById(itemId);
            var itemVM = invoiceitems.find(itemId);
            console.log(JSON.stringify(itemVM));
        };
        $scope.Submit = function () {
            // if (isValid) {
            var newInvoice = {
                Id: uuid2.newguid(),
                ClientId: selectedClient.Id,
                Details: invDetails,
                Items: $scope.invitems,
                SubTotal: $scope.SubTotal,
                VAT: $scope.VAT,
                Total: $scope.Total,
                DateCreated: new Date(),
                //LastUpdated: new Date(), show be null during adding and update in the update request 
                BusinessId: busvm.BusinessId
            };
            //console.log(JSON.stringify(newInvoice));
            invoiceService.SaveInvoice(newInvoice).success(function (data) {
                invoiceitems.list.length = 0; //reset factory items list to 0 
                $scope.selectedClientName = null; //reset client to null 
                invDetails = null; //reset details to null
                invoicedetailVM = null;
                $rootScope.prvInvOrderId = data;
                factoryManagerService.set("prevInvOrderId", JSON.stringify($rootScope.prvInvOrderId));
                $state.go('menu.tabs.invoice');
            }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Server Error!',
                    template: 'Please try again!'
                });
            });

            //}
        }
        //$scope.$on('$ionicView.afterLeave', function () {
        //    alert("After Leaving");
        //    invoiceitems.list.length = 0; //reset factory items list to 0 
        //    selectedClient = null; //reset client to null 
        //    invoicedetailVM = null; //reset details to null
        //});

    }])
    .controller('lkpClientCtrl', ['$scope', '$ionicModal', 'factoryManagerService', 'clientFactory', '$state', function ($scope, $ionicModal, factoryManagerService, clientFactory, $state) {
        $scope.client = {};
        $scope.clientAdd = {};
        //$scope.clients = {};       
        var clientCollection = factoryManagerService.get("clientsVM");
        if (clientCollection !== null && clientCollection !== undefined) {
            var cl = JSON.parse(clientCollection);
            //console.log("clients list: " + JSON.stringify(cl));
            $scope.clients = cl;
            $scope.selectedClient = function (client) {
                $scope.modal.hide();
                clientFactory.prepForBoradcast(client);
                history.back();
                // $state.go('menu.tabs.createinvoice');
            };
        };
        $ionicModal.fromTemplateUrl('clientmodal.html', {
            scope: $scope,
            animation: 'fadeInLeftBig'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        // Clean up the modal view.
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        $scope.Submit = function (isValid) {
            var clientAdd = $scope.clientAdd;

            var client = {
                name: $scope.client.Name,
                RegNo: $scope.client.RegNo,
                VATNo: $scope.client.VATNo,
                Address: clientAdd
            };
            clientFactory.insertClient(client).then(function (response) {
                $scope.status = 'Inserted client! Refreshing list';
                // $scope.clients.push(client);
            }, function (error) {
                $scope.status = 'Unable to update client: ' + error.message;
            });
        };

    }])
    //.controller('lkpClientlstCtrl', ['$scope', 'factoryManagerService', 'clientFactory', '$state', function ($scope, factoryManagerService, clientFactory, $state) {

    //    var clientCollection = factoryManagerService.get("clientsVM");
    //    if(clientCollection!==null && clientCollection!==undefined)
    //    {
    //        var cl = JSON.parse(clientCollection);
    //        $scope.clients = cl;
    //        $scope.selectedClient = function (client) {
    //            clientFactory.prepForBoradcast(client);
    //            //$state.go('menu.tabs.createinvoice', null, {
    //            //    //reload: false,
    //            //    location: false,
    //            //    //notify: false
    //            //});
    //            //$location.url('/menu/tab/createinvoice').replace();
    //            //$state.go('menu.tabs.lkpclient');
    //            $state.go('menu.tabs.createinvoice');
    //            //$window.history.back();
    //        };
    //    };

    //}])
    .controller('invoiceDetailCtrl', ['$scope', 'invoicedetailVM', function ($scope, invoicedetailVM) {
        //var invm = invoiceService.getInvDetail();       
        if (invoicedetailVM !== null && invoicedetailVM !== undefined) {
            // if (invoicedetailVM.InvoiceDetailId > 0) {
            $scope.invoiceDetails = invoicedetailVM;
            //}
            //else {
            //  $scope.invoiceDetails = invoicedetailVM;
            //}          
        }
        else {
            $scope.invoiceDetails = {};
        }
    }])
    .controller('invoiceDetailEditCtrl', ['$scope', 'invoicedetailEditVM', function ($scope, invoicedetailEditVM) {
        if (invoicedetailEditVM !== null && invoicedetailEditVM !== undefined) {
            $scope.invoiceDetailEdit = invoicedetailEditVM;
        }
        else {
            $scope.invoiceDetailEdit = {};
        }
    }])
    .controller('invoiceitemupdtCtrl', ['$scope', 'itemVM', 'invoiceitems', '$state', '$ionicPopup', function ($scope, itemVM, invoiceitems, $state, $ionicPopup) {
        $scope.tempTotalHold = 0;
        $scope.selectedRate = 0;
        console.log("itemUP" + itemVM.Total);
        if (itemVM !== null && itemVM !== undefined && itemVM.Description !== '') {
            $scope.itemVMUP = itemVM;
        }
        else {
            $scope.itemVMUP = {};
        }
        $scope.Update = function () {
            if ($scope.itemVMUP.Id !== null && $scope.itemVMUP.Id !== undefined) {
                //update item
                $scope.itemVMUP.Total = $scope.itemVMUP.Total + $scope.itemVMUP.VAT;
                $scope.itemVMUP.SubTotal = parseFloat($scope.itemVMUP.Quantity) * parseFloat($scope.itemVMUP.Price)
                var newItem = {
                    Id: $scope.itemVMUP.Id,
                    Description: $scope.itemVMUP.Description,
                    Quantity: $scope.itemVMUP.Quantity,
                    Price: $scope.itemVMUP.Price,
                    VATRate: $scope.itemVMUP.VATRate,
                    VAT: $scope.itemVMUP.VAT,
                    Total: $scope.itemVMUP.Total,
                    SubTotal: $scope.itemVMUP.SubTotal
                };
                invoiceitems.update(newItem);
                console.log(JSON.stringify(invoiceitems.list));
                history.back();
                //$state.go('menu.tabs.createinvoice');                
            }
        };
        $scope.confirmDelete = function (itemId) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Delete',
                template: 'Are you sure you want to delete this item?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    invoiceitems.delete(itemId);
                    history.back();
                    // $state.go('menu.tabs.createinvoice');          
                } else {
                    console.log('You are not sure');
                }
            });
        };
        $scope.buttonClicked = function (rate) {
            $scope.selectedRate = parseInt(rate);
            // console.log(selectedRate);
            $scope.itemVMUP.VAT = '';
            if (($scope.selectedRate !== undefined) && ($scope.selectedRate !== null) && ($scope.selectedRate !== 0)) {

                $scope.tempTotalHold = $scope.itemVMUP.Total * ($scope.selectedRate / 100);
                $scope.itemVMUP.VAT = $scope.tempTotalHold;
                $scope.itemVMUP.VATRate = parseFloat(rate);
            }
            else {
                $scope.itemVMUP.VAT = 0;
                $scope.tempTotalHold = 0;
                $scope.itemVMUP.VATRate = parseFloat(rate);
            }
            $scope.$apply();
        }
        $scope.$watch('itemVMUP.Quantity * itemVMUP.Price', function (value) {
            $scope.itemVMUP.Total = value;
        });
    }])
    .controller('invoiceitemCtrl', ['$scope', 'invoiceService', 'invoiceitems', 'uuid2', '$state', function ($scope, invoiceService, invoiceitems, uuid2, $state) {

        $scope.tempTotalHold = 0;
        $scope.selectedRate = 0;
        $scope.itemVM = {};
        $scope.itemVM.VAT = 0;
        $scope.itemVM.VATRate = 0.00;

        $scope.Submit = function () {
            var item = {
                Id: uuid2.newguid(),
                Description: $scope.itemVM.Description,
                Quantity: $scope.itemVM.Quantity,
                Price: $scope.itemVM.Price,
                VATRate: $scope.itemVM.VATRate,
                VAT: $scope.itemVM.VAT,
                Total: ($scope.itemVM.Total + $scope.itemVM.VAT),
                SubTotal: parseFloat($scope.itemVM.Quantity) * parseFloat($scope.itemVM.Price)
            };
            invoiceitems.add(item);
            history.back();

        };
        $scope.$watch('itemVM.Quantity * itemVM.Price', function (value) {
            $scope.itemVM.Total = value;
        });
        $scope.buttonClicked = function (rate) {
            $scope.selectedRate = parseInt(rate);
            console.log($scope.selectedRate);

            if (($scope.selectedRate !== undefined) && ($scope.selectedRate !== null) && ($scope.selectedRate !== 0)) {

                $scope.tempTotalHold = $scope.itemVM.Total * ($scope.selectedRate / 100);
                $scope.itemVM.VAT = $scope.tempTotalHold;
                $scope.itemVM.VATRate = parseFloat(rate);
            }
            else {
                $scope.itemVM.VAT = 0;
                $scope.tempTotalHold = 0;
                $scope.itemVM.VATRate = parseFloat(rate);
            }
            $scope.$apply();
        };
    }])
    .controller('settingsCtrl', ['$scope', function ($scope) {

    }])
    .controller('sendFeedbackCtrl', ['$scope', 'factoryManagerService', '$http', '$ionicPopup', '$state', 'config', function ($scope, factoryManagerService, $http, $ionicPopup, $state, config) {
        $scope.emailvm = {};
        var senderStr = factoryManagerService.get("senvm");
        if (senderStr !== null && senderStr !== undefined) {
            var sen = JSON.parse(senderStr);
        }
        //var Indata = { 'email': sen.Email, 'To': emailvm.To, "Body": emailvm.Body };
        if (sen !== null && sen !== undefined) {
            $scope.emailvm.Email = sen.Email;
        }

        $scope.emailvm.To = "asasoftwaresolutions@outlook.com";
        $scope.Submit = function (isvalid) {
            if (isvalid) {
                $http({
                    method: 'POST',
                    url: config.apiUrl + "/sendfeedback",
                    dataType: 'json',
                    data: $scope.emailvm,
                    headers: { 'Content-Type': 'application/json' }
                    //,params: { busStr: angular.toJson($scope.businessvm, false) }
                }).success(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Submitted',
                        template: 'Feedback submitted, Thank you!'
                    }).then(function () {
                        $state.go('menu.tabs.dashboard');
                    });
                })
                    .error(function (resp) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Internal Server Error!',
                            template: 'Please re submit!'
                        });
                    })

            }
        }
    }])
    .controller('AppCtrl', function () {

        //ionic.Platform.ready(function () {

        //})
    });
