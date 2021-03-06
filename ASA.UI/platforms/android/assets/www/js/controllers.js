﻿angular
    .module('asaApp')
    .controller('DashboardController', ['$scope', 'factoryManagerService','payVMService', 'amCharts', function ($scope,factoryManagerService, payVMService, amCharts) {
        $scope.$on('$ionicView.enter', function () {
            // code to run each time view is entered
            $scope.items = [];
            var pvmArr = [];
            var periodData = factoryManagerService.get("periodlist");
            var strdata = factoryManagerService.get("submissionlist");
            if (periodData !== null && periodData !== undefined) {
                var periods = JSON.parse(periodData);
                if (periods !== null && periods !== undefined) {
                    $scope.items = angular.copy(periods);
                }
            }
            pvmArr.length = 0;//clear array before push
            if (strdata !== null && strdata !== undefined) {
                var data = JSON.parse(strdata);
                              
                if (data !== null && data !== undefined) {
                    var reverseArray = data.reverse();
                    var tempData = reverseArray.slice(0,4); //get recent four quaters
                    for (var i = 0; i < tempData.length; i++) {
                        var pvm = {
                            "PeriodId": "",
                            "value": parseInt(0),
                            "TotalSalesGross": parseInt(0)
                            //TODO:// add vat percentage caliculated based on vat rate and display
                        };//clear model values before populating 

                        //var currentTime = new Date();
                        //var currentYear = currentTime.getFullYear(); //datetype 
                        //var strsubmissionYear = data[i].id.substring(0, 4);//stringtype 
                        //var submissionyear = new Date(strsubmissionYear); //convert here 
                        //var year = submissionyear.getFullYear();
                        //console.log(JSON.stringify(currentYear));
                        //console.log(JSON.stringify(year));
                        //if (year >= currentYear) {
                        //    //console.log(pvm.PeriodId);
                        //    pvmArr.push(pvm);
                        //}
                        pvm.PeriodId = tempData[i].id;
                        pvm.value = parseInt(tempData[i].value.PaymentNotification.NetVAT);
                        pvm.TotalSalesGross = parseInt(tempData[i].value.TotalSalesGross);
                        pvmArr.push(pvm);
                    }
                }
            }

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
    .controller('subCtrl', ['$scope', 'payvm', 'factoryManagerService', '$rootScope', '$http', '$ionicPopup', function ($scope, payvm, factoryManagerService, $rootScope, $http, $ionicPopup) {
        $scope.payvm = payvm;
        var senderStr = factoryManagerService.get("senvm");
        if (senderStr !== null && senderStr !== undefined) {
            var sen = JSON.parse(senderStr);
        }
        if (sen !== null && sen !== undefined)
        {
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
                    url: "http://asadev-api.azurewebsites.net/api/Export",
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
    .controller('ListCtrl', function ($scope) {

    $scope.data = {
        showDelete: false
    };

    $scope.itemButtons = [
      {
          text: 'Delete',
          type: 'button-assertive',
          onTap: function (item) {
              alert('Delete Item: ' + item.id + ' ?');
          }
      }
    ];

    $scope.onItemDelete = function (item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.items = [
      {
          id: 1
      },
      {
          id: 2
      },
      {
          id: 3
      },
      {
          id: 4
      },
      {
          id: 5
      },
      {
          id: 6
      },
      {
          id: 7
      },
      {
          id: 8
      },
      {
          id: 9
      },
      {
          id: 10
      }
    ];
   

})
    .controller('ReturnsTabCtrl', ['$scope', 'factoryManagerService', 'asaApp', '$filter', '$http', 'Constants', 'utilsFactory', '$rootScope', '$ionicPopup', '$ionicModal', 'usSpinnerService', '$state', function ($scope, factoryManagerService, asaApp, $filter, $http, Constants, utilsFactory, $rootScope, $ionicPopup, $ionicModal, usSpinnerService, $state) {
      $scope.$on('$ionicView.loaded', function () {
          if (factoryManagerService !== null && factoryManagerService !== undefined) {
              var bus = factoryManagerService.get("busvm");
              var period = factoryManagerService.get("pervm");
              var add = factoryManagerService.get("addvm");
              var sen = factoryManagerService.get("senvm");

              if ((bus === null || bus === undefined)) {
                  $ionicPopup.alert({
                      scope: $scope,
                      content: '<span>Please complete account profile before any submissions to HMRC.</span>',
                      title: 'Warning'
                  })
              }
              else {
                  if ((period === null || period === undefined)) {
                      $ionicPopup.alert({
                          scope: $scope,
                          content: '<span>Please complete account profile before any submissions to HMRC.</span>',
                          title: 'Warning'
                      })
                  }
                  else {
                      if ((add === null || add === undefined)) {
                          $ionicPopup.alert({
                              scope: $scope,
                              content: '<span>Please complete account profile before any submissions to HMRC.</span>',
                              title: 'Warning'
                          })
                      }
                      else {
                          if ((sen === null) || (sen === undefined)) {
                              $ionicPopup.alert({
                                  scope: $scope,
                                  content: '<span>Please complete account profile before any submissions to HMRC.</span>',
                                  title: 'Warning'
                              });
                          }
                          else
                          {
                              var senDetails = JSON.parse(sen);
                              if (senDetails !== null && senDetails !== undefined) {
                                  if ((senDetails.SenderId === null || senDetails.SenderId === undefined) && (senDetails.SenderPassword === null || senDetails.SenderPassword === undefined)) {
                                      $ionicPopup.alert({
                                          scope: $scope,
                                          content: '<span>Please complete account profile before any submissions to HMRC.</span>',
                                          title: 'Warning'
                                      });
                                  }
                              }


                          }
                      }

                  }
              }
              
          }
          if(asaApp!==null&&asaApp!==undefined)
          {
              var isExp = asaApp.istrailPeriodExpired();
              if(isExp===true)
              {
                  $ionicPopup.alert({
                      scope: $scope,
                      content: '<span>Trail period expired, please download pro version from apple or google store.</span>',
                      title: 'Status'
                  });
                  $state.go('menu.tabs.dashboard', {}, { reload: true, notify: true });
              }

          }
      });
      $scope.modes = [{name : "testInLive", id: 1}, { name: "Live", id: 0}];
      $scope.vatvm = {
         
      };
      $scope.$watch('vatvm.VATDueOnOutputs + vatvm.VATDueOnECAcquisitions', function (value) {
          $scope.vatvm.TotalVAT = value;
      });

      $scope.periodvm = {};
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
     // var pervmObjsListStr = localStorage.getItem("periodlist"); //read from local storage 
      //if (pervmObjsListStr!==null) {
      //    pervmObjsList = JSON.parse(pervmObjsListStr);
      //    var pervmObj = pervmObjsList[pervmObjsList.length - 1];
      //    console.log("permodel" + JSON.stringify(pervmObj));
      //}
      //var busvmObj = localStorage.getItem("busvm");
      //var senvmObj = localStorage.getItem("senvm");
      //var addvmObj = localStorage.getItem("addvm");
     // var pervmObj = localStorage.getItem("pervm");

      //console.log("busmodel" + JSON.stringify(busvmObj));
      //console.log("senmodel" + JSON.stringify(senvmObj));
      //console.log("addmodel" + JSON.stringify(addvmObj));
      //if (pervmObj !== undefined && pervmObj !== null) {
        //  var pervm = JSON.parse(pervmObj);
      //}
      var busvm = factoryManagerService.getObject("busvm");
      var senvm = factoryManagerService.getObject("senvm");
      var addvm = factoryManagerService.getObject("addvm");
      var pervm = factoryManagerService.getObject("pervm");

      $scope.checkUserRole = function () {
          var email = senvm.Email;
          if(email!==null&&email!==undefined){
              if ((email.toLowerCase() === "asasoftwaresolutions@outlook.com") || (email.toLowerCase() === "asavattest@gmail.com"))
              {
                  return true;
              }
              return false;
          }
      };
      //console.log("beforeperiodvm" + JSON.stringify(pervm));
      if (pervm !== null && pervm !== undefined) {
          $scope.periodvm = pervm;//uncommented out 20/07/2017
          //var pervmObj = JSON.parse(pervm);

          $scope.periodvm.StartPeriod = new Date(pervm.StartPeriod);
          $scope.periodvm.EndPeriod = new Date(pervm.EndPeriod);
          //var newdate = $scope.periodvm.StartPeriod;
          //$scope.periodvm.TaxQuater = pervmObj.TaxQuater;
          // $scope.periodvm.periodId = pervmObj.periodId;
          $scope.periodvm.periodId = $filter('date')($scope.periodvm.StartPeriod, "yyyy-MM"); //load default value 
         // $scope.periodvm.periodId = function (newdate) {
           //   this.periodvm.periodId = $filter('date')(newdate, "yyyy-MM");
          //}
          $scope.controllerFunction = function (valueFromDirective) {
              console.log(valueFromDirective);
              var tempdate = new Date(valueFromDirective);
              console.log("fromview" + $filter('date')(tempdate, "yyyy-MM"));

              $scope.periodvm.periodId = $filter('date')(tempdate, "yyyy-MM");
          };
      }
      else {
          console.log("load view with empty fields");
          var temp;
          $scope.controllerFunction = function (valueFromDirective) {
              //console.log(valueFromDirective);
              var tempdate = new Date(valueFromDirective);
              //console.log("fromview" + $filter('date')(tempdate, "yyyy-MM"));

              temp = $filter('date')(tempdate, "yyyy-MM");
          }
          $scope.periodvm = {
              StartPeriod: '',
              EndPeriod: '',
              PeriodId: temp
              };
          
      }
      //console.log("periodvm" + JSON.stringify($scope.periodvm));
      //console.log("rootscopetest" + $rootScope.periodList);
      var getMode = function () {
          if($scope.mode.selectedMode===null ||$scope.mode.selectedMode===undefined)
          {
              return "0";
          }
          else {
              return $scope.mode.selectedMode.id;
          }
      };
      $scope.Submit = function (isValid) {
          if (isValid) {
              $scope.startSpin();
              $http({
                  method: 'POST',
                  url: "http://asadev-api.azurewebsites.net/api/submission",
                  dataType: 'json',
                  data: {
                      VAT100ViewModel: $scope.vatvm,
                      PeriodViewModel: $scope.periodvm,
                      BusinessViewModel: busvm,
                      AddressViewModel: addvm,
                      SenderViewModel: senvm,
                      Runmode: getMode()
                  },
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

      $scope.ExtractData = function (hrespone,hperiod ,hpayment) {
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
          for (var i = 0; i < hrespone.length; i++)
          {
              var data = hrespone[i];
              //messageInfo = data;
              // console.log("messageinfo" + messageInfo.code);
              items.push(data); //push messageInfo instead of data
          }
          for (j = 0; j < items.length; j++)
          {
              var temp = items[j];
              $scope.subitems.push(temp['q1:Message']);
          }
          for (var k = 0; k < $scope.subitems.length; k++)
          {
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
          for (var m = 0;m < hpayment.length; m++) {
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
              var strsubList = factoryManagerService.get("submissionlist");
              if (strsubList !== null && strsubList !== undefined)
              {
                  var sublist = JSON.parse(strsubList);
                  if(sublist!==null&&sublist!==undefined)
                  {
                      sublist.push({ id: periodInfo.VATPeriod.PeriodId.toString(), value: paymentInfo });
                      localStorage.setItem("submissionlist", JSON.stringify(sublist));
                  }
              }
              else {
                  $rootScope.submissionList.push({ id: periodInfo.VATPeriod.PeriodId.toString(), value: paymentInfo });
                  factoryManagerService.set("submissionlist", JSON.stringify($rootScope.submissionList));
              }
          }
          $scope.periodvm.status = Constants.Status[4]; //add status and push into array 
          var strpdata = factoryManagerService.get("periodlist"); //localStorage.getItem("periodlist");
          if (strpdata !== null && strpdata !== undefined) {
              var pdata = JSON.parse(strpdata);
          }
          //should be arrayList pdata
          if (pdata !== null && pdata !== undefined) {
              pdata.push($scope.periodvm); //if its array then push new item into it 
              factoryManagerService.set("periodlist", JSON.stringify(pdata));//localStorage.setItem("periodlist", JSON.stringify(pdata)); //save it back in the local storage 
          }
          else {
              $rootScope.periodList.push($scope.periodvm);//push item in global array list
              factoryManagerService.set("periodlist", JSON.stringify($rootScope.periodList));//localStorage.setItem("periodlist", JSON.stringify($rootScope.periodList));//then save item in local storage
          }

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
             
              //$rootScope.periodList.push($scope.periodvm);
              //localStorage.setItem("periodlist", JSON.stringify($rootScope.periodList));

              pervm.StartPeriod = utilsFactory.addMonths(pervm.StartPeriod, 3);//add new pervm with next quater details and save in locla storage 
              pervm.EndPeriod = utilsFactory.addMonths(pervm.EndPeriod, 3);
              pervm.periodId = $filter('date')(pervm.StartPeriod, "yyyy-MM");
              pervm.status = '';
              factoryManagerService.set("pervm", JSON.stringify(pervm));//localStorage.setItem("pervm", JSON.stringify(pervm));

              $state.go('menu.tabs.dashboard', null, { reload: true, notify: true });
          });
        }
     // $scope.fromService = testService.sayHello("World");
      //$scope.showActionsheet = function () {
      //    $ionicActionSheet.show({
      //        titleText: 'Ionic ActionSheet',
      //        buttons: [
      //          {
      //              text: 'Facebook'
      //          },
      //          {
      //              text: 'Twitter'
      //          },
      //        ],
      //        destructiveText: 'Delete',
      //        cancelText: 'Cancel',
      //        cancel: function () {
      //            console.log('CANCELLED');
      //        },
      //        buttonClicked: function (index) {
      //            console.log('BUTTON CLICKED', index);
      //            return true;
      //        },
      //        destructiveButtonClicked: function () {
      //            console.log('DESTRUCT');
      //            return true;
      //        }
      //    });
      //};
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
//.controller('MenuCtrl', ['$scope', 'BUILD', function ($scope, BUILD) {
//    $scope.appVersion = BUILD.VERSION;
//}])
    //.controller('versionCtrl', ['$scope', function ($scope) {
    //    $scope.appVersion = "0.000";
       
    //}])
    .controller('sendFeedbackCtrl', ['$scope', 'factoryManagerService', '$http', '$ionicPopup', '$state', function ($scope, factoryManagerService, $http, $ionicPopup, $state) {
    $scope.emailvm = {};
    var senderStr = factoryManagerService.get("senvm");
    if (senderStr !== null && senderStr !== undefined) {
        var sen = JSON.parse(senderStr);
    }
        //var Indata = { 'email': sen.Email, 'To': emailvm.To, "Body": emailvm.Body };
    if (sen !== null && sen !== undefined)
    {
        $scope.emailvm.Email = sen.Email;
    }
    
    $scope.emailvm.To = "asasoftwaresolutions@outlook.com";
    $scope.Submit = function (isvalid) {
       if (isvalid) {
            $http({
                method: 'POST',
                url: "http://asadev-api.azurewebsites.net/api/sendfeedback",
                dataType: 'json',
                data:  $scope.emailvm,
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
