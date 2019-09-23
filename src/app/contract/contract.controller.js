(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractController', ContractController);

    function ContractController($scope, $timeout, moment, Upload, IMGUR_API, uiCalendarConfig, ContractLogManager, ContractManager, HdLuuThongManager, Restangular, CustomerManager, CONTRACT_EVENT) {

        $scope.showInfoCus = false;

        /* event source that contains custom events on the scope */
        $scope.events = [];

        let debitArr = [];
        let prepayArr = [];
        let traNoArr = [];

        $scope.selectedCustomer = {};
        $scope.formProcessing = false;
        $scope.contracts = [];
        $scope.filter = {contractNo: ""};
        $scope.contractInfo = {};

        $scope.getContractsByCus = function (selectedCustomer) {
            $scope.selectedCustomer = selectedCustomer;
            // $scope.selectedCustomer.createdAt = moment($scope.selectedCustomer.createdAt).format("DD/MM/YYYY");
            $scope.$apply();

            $scope.formProcessing = true;

            ContractManager
                .one($scope.selectedCustomer.customer._id)
                .one("byCustomer")
                .getList()
                .then((results) => {
                    $scope.selectedCustomer.customer.photo = results[0].photo;
                    let contracts = Restangular.stripRestangular(results[1]);
                    $scope.contracts = contracts;

                    let selectedItem = _.find(contracts, item => {
                        return item.contractNo === $scope.selectedCustomer.contractNo;
                    });
                    if (selectedItem !== undefined) {
                        $scope.fromSelected(selectedItem);
                    }

                })
                .finally(() => {
                    $scope.formProcessing = false;
                });

            // $('#customerContractModal').modal('show');

            $scope.showInfoCus = true;
        };

        $scope.hideInfoCus = () => {
            $scope.showInfoCus = false;
            $scope.selectedCustomer = {};
            $scope.formProcessing = false;
            $scope.contracts = [];
            $scope.filter.contractNo = "";
            $scope.contractInfo = {};
            contractNo = "";
            debitArr = [];
            prepayArr = [];

            _.remove($scope.events, function (item) {
                return item;
            });
            if (uiCalendarConfig.calendars["myCalendar1"] !== undefined) {
                uiCalendarConfig.calendars["myCalendar1"].fullCalendar('prev');
                uiCalendarConfig.calendars["myCalendar1"].fullCalendar('next');
            }

            $scope.$broadcast(CONTRACT_EVENT.RESIZE_TABLE);
        };

        $scope.contractSelected = {};

        $scope.dongTienFunc = () => {
            $scope.formProcessing = true;

            HdLuuThongManager
                .one($scope.contractSelected._id)
                .one('updateTotalMoneyPaidTCB')
                .customPUT({
                    newPayMoney: $scope.contractSelected.newPayMoney,
                    payDate: $scope.contractSelected.payDate
                })
                .then((contract) => {
                    toastr.success('Đóng tiền thành công!');

                    $('#dongTienModal').modal('hide');
                    $scope.$broadcast(CONTRACT_EVENT.UPDATE_SUCCESS);
                })
                .catch((error) => {
                    toastr.error('Có lỗi xảy ra. Hãy thử lại!');
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        $scope.editDongTienFunc = () => {
            $scope.formProcessing = true;
            $scope.contractSelected.isTVChotBe = true;

            HdLuuThongManager
                .one($scope.contractSelected.contractId)
                .one('editMoneyPaidPerDay')
                .customPUT($scope.contractSelected)
                .then((contract) => {
                    toastr.success('Cập nhật tiền đóng thành công!');

                    $('#suaTienDongModal').modal('hide');
                    $scope.$broadcast(CONTRACT_EVENT.UPDATE_SUCCESS);
                })
                .catch((error) => {
                    toastr.error("Có lỗi xảy ra! Hãy thử lại");
                })
                .finally(() => {
                    $scope.formProcessing = false;
                });
        };

        // $('#dongTienModal').on('hidden.bs.modal', function () {
        //     $scope.contractSelected.payDate = "";
        //     $scope.contractSelected = {};
        //     $('#payDate').val("");
        // });
        //
        // $('#dongTienModal').on('show.bs.modal', function () {
        //     $scope.contractSelected.payDate = "";
        // });

        let contractNo = "";
        $scope.fromSelected = function (item, model) {
            if (contractNo === item.contractNo)
                return;
            contractNo = item.contractNo;
            $scope.filter.contractNo = item.contractNo;

            _.remove($scope.events, function (item) {
                return item;
            });
            $scope.contractInfo = {};
            // uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEvents');

            ContractLogManager
                .one(item._id)
                .get()
                .then((contract) => {
                    if (!contract)
                        return;

                    $scope.contractInfo.createdAt = moment(contract.createdAt).format("DD/MM/YYYY");
                    $scope.contractInfo.loanMoney = contract.loanMoney;
                    $scope.contractInfo.actuallyCollectedMoney = contract.actuallyCollectedMoney;
                    $scope.contractInfo.moneyContractOld = parseInt(contract.actuallyCollectedMoney) - parseInt(contract.totalMoneyPaid); // - parseInt(moneyPaid);
                    $scope.contractInfo.loanDate = contract.loanDate;
                    $scope.contractInfo.loanEndDate = contract.loanEndDate;
                    $scope.contractInfo.startLoanDate = contract.createdAt;

                    contract.histories = contract.histories.filter((item) => {
                        return item.title;
                    });

                    debitArr = contract.histories
                        .filter(item => {
                            return item.title === "Nợ";
                        }).map(item => {
                            return moment(item.start).format("YYYY-MM-DD");
                        });

                    prepayArr = contract.histories
                        .filter(item => {
                            return item.title === "Đã đóng";
                        }).map(item => {
                            return moment(item.start).format("YYYY-MM-DD");
                        });

                    traNoArr = contract.histories
                        .filter(item => {
                            return item.title === "Trả nợ";
                        }).map(item => {
                            return moment(item.start).format("YYYY-MM-DD");
                        });

                    setTimeout(function () {
                        // uiCalendarConfig.calendars['myCalendar1'].fullCalendar('rerenderEvents' );
                        $scope.events.push(...contract.histories);
                    }, 0);
                })
                .finally(() => {

                    //
                    $timeout(function () {
                        uiCalendarConfig.calendars["myCalendar1"].fullCalendar('changeView', $scope.currentView);
                        uiCalendarConfig.calendars["myCalendar1"].fullCalendar('prev');
                        uiCalendarConfig.calendars["myCalendar1"].fullCalendar('next');
                    });

                    // setTimeout(function () {
                    // uiCalendarConfig.calendars['myCalendar1'].fullCalendar('addEventSource', $scope.events);
                    // uiCalendarConfig.calendars['myCalendar1'].fullCalendar('rerenderEvents');
                    // }, 500);
                });
        };

        // $scope.changeTo = 'English';
        $scope.currentView = 'month';

        // $scope.events = [{
        //     title: 'All Day Event',
        //     start: new Date(y, m, 1)
        // }, {
        //     title: 'Long Event',
        //     start: new Date(y, m, d - 5),
        //     end: new Date(y, m, d - 2)
        // }, {
        //     id: 999,
        //     title: 'Repeating Event',
        //     start: new Date(y, m, d - 3, 16, 0),
        //     allDay: false
        // }, {
        //     id: 999,
        //     title: 'Repeating Event',
        //     start: new Date(y, m, d + 4, 16, 0),
        //     allDay: false
        // }, {
        //     title: 'Birthday Party',
        //     start: new Date(y, m, d + 1, 19, 0),
        //     end: new Date(y, m, d + 1, 22, 30),
        //     allDay: false
        // }, {
        //     title: 'Click for Google',
        //     start: new Date(y, m, 28),
        //     end: new Date(y, m, 29)
        // }];

        /* event source that calls a function on every view switch */
        // $scope.eventsF = function (start, end, timezone, callback) {
        //     let s = new Date(start).getTime() / 1000;
        //     let e = new Date(end).getTime() / 1000;
        //     let m = new Date(start).getMonth();
        //     let events = [{
        //         title: 'Feed Me ' + m,
        //         start: s + (50000),
        //         end: s + (100000),
        //         allDay: false,
        //         className: ['customFeed']
        //     }];
        //     callback(events);
        // };

        $scope.ev = {};

        /* alert on dayClick */
        // $scope.alertOnDayClick = function (date) {
        //     $scope.alertMessage = (date.toString() + ' was clicked ');
        //     $scope.ev = {
        //         from: date.format('YYYY-MM-DD'),
        //         to: date.format('YYYY-MM-DD'),
        //         title: '',
        //         allDay: true
        //     };
        // };

        /* alert on eventClick */
        // $scope.alertOnEventClick = function (date, jsEvent, view) {
        //     $scope.alertMessage = (date.title + ' was clicked ');
        // };

        /* Change View */
        $scope.changeView = function (view, calendar) {
            // setTimeout(function () {
            $scope.currentView = view;
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
            // }, 500);

        };
        /* Change View */
        $scope.renderCalender = function (calendar) {
            $timeout(function () {
                if (uiCalendarConfig.calendars[calendar]) {
                    uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
            });
        };
        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
        };

        /* event sources array*/
        $scope.eventSources = [$scope.events];

        $scope.dayRender = function (date, cell) {
            if ($scope.contractInfo.hasOwnProperty("createdAt")) {
                if (date.diff(moment($scope.contractInfo.startLoanDate), 'days') >= 0 &&
                    date.diff(moment($scope.contractInfo.loanEndDate), 'days') <= 0) {
                    let dateCalendar = moment(date).format("YYYY-MM-DD");

                    // Trường hợp nợ = 0 thì hiển thị ô màu tím
                    if (debitArr.indexOf(dateCalendar) >= 0) {
                        cell.css("background-color", "#6f00ff");
                    }
                    // Trường hợp đóng trước thì hiển thị ô màu xanh dương
                    else if (prepayArr.indexOf(dateCalendar) >= 0) {
                        cell.css("background-color", "#00bfff");
                    }
                    // Trường hợp trả nợ thì hiển thị ô màu xanh lá cây
                    else if (traNoArr.indexOf(dateCalendar) >= 0) {
                        cell.css("background-color", "#9acd32");
                    }
                    // Gói vay bắt đầu --> kết thúc hiển thị ô màu vàng
                    else
                        cell.css("background-color", "#ffff00");
                } else
                    cell.css("background-color", "");
            }

        };

        /* config object */
        $scope.uiConfig = {
            calendar: {
                locale: 'vi',
                height: 450,
                editable: false,
                displayEventTime: false,
                header: {
                    left: 'title',
                    // center: 'myCustomButton',
                    right: 'today prev,next'
                },
                dayRender: $scope.dayRender,
                // eventAfterRender: function(event, element, view) {
                //     $(element).css('width','10px');
                // },
                // dayClick: $scope.alertOnDayClick,
                // eventClick: $scope.alertOnEventClick,
                eventRender: $scope.eventRender,
                dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
                dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                monthNamesShort: ['Th01', 'Th02', 'Th03', 'Th04', 'Th05', 'Th06', 'Th07', 'Th08', 'Th09', 'Th10', 'Th11', 'Th12']
            }
        };

        $scope.uploadNew = function (fileUpload) {
            if (!fileUpload)
                return;

            // Upload.resize(fileUpload, {width: 500, height: 500, centerCrop: true})
            //     .then(function (resizedFile) {

            Upload.http({
                url: IMGUR_API.URL,
                data: fileUpload,
                headers: {'Authorization': IMGUR_API.CLIENT_ID, 'Content-Type': fileUpload.type},
            })
                .progress(function (evt) {
                    // let progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' + $scope.log;
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                })
                .success(function (data, status, headers, config) {
                    CustomerManager
                        .one($scope.selectedCustomer.customer._id)
                        .customPUT({photo: data.data.link})
                        .then((item) => {
                            $scope.selectedCustomer.customer.photo = data.data.link;
                        })
                        .catch((error) => {
                            // console.log(error);
                        })
                        .finally(() => {
                        });

                    // $scope.log = 'File ' + config.file.name + ' uploaded.';
                })
                .error(function (data, status, headers, config) {
                    // console.log("Error: " + data);
                });
            // });

            // var fileReader = new FileReader();
            // fileReader.readAsArrayBuffer(fileUpload);
            // fileReader.onload = function (e) {
            //
            // }
        };

        $timeout(function () {
            // hotInstance = hotRegisterer.getInstance('my-handsontable');

            // $scope.onAfterInit = function () {
            //     hotInstance.validateCells();
            // };

            Inputmask({}).mask(document.querySelectorAll(".datemask"))

        }, 0);

    }
})();
