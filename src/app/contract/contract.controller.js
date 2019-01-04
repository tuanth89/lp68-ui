(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractController', ContractController);

    function ContractController($scope, moment, Upload, IMGUR_API, uiCalendarConfig, ContractLogManager, ContractManager, Restangular, CustomerManager) {

        $scope.showInfoCus = false;

        /* event source that contains custom events on the scope */
        $scope.events = [];

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
                    $scope.contracts = Restangular.stripRestangular(results[1]);
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
            $scope.contractInfo = {};
            _.remove($scope.events, function (item) {
                return item;
            });
        };

        // $('#customerContractModal').on('hidden.bs.modal', function () {
        //     $scope.selectedCustomer = {};
        //     $scope.formProcessing = false;
        //     $scope.contracts = [];
        //     $scope.filter = {contractNo: ""};
        //     $scope.contractInfo = {};
        //     uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEvents');
        // });

        let contractNo = "";
        $scope.fromSelected = function (item, model) {
            if (contractNo === item.contractNo)
                return;
            contractNo = item.contractNo;

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

                    $scope.events.push(...contract.histories);

                })
                .finally(() => {

                    uiCalendarConfig.calendars['myCalendar1'].fullCalendar('renderEvent', $scope.events, true);
                    // setTimeout(function () {
                    // uiCalendarConfig.calendars['myCalendar1'].fullCalendar('addEventSource', $scope.events);
                    // uiCalendarConfig.calendars['myCalendar1'].fullCalendar('rerenderEvents');
                    // }, 500);
                });
        };

        // let date = new Date();
        // let d = date.getDate();
        // let m = date.getMonth();
        // let y = date.getFullYear();

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
        $scope.eventsF = function (start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{
                title: 'Feed Me ' + m,
                start: s + (50000),
                end: s + (100000),
                allDay: false,
                className: ['customFeed']
            }];
            callback(events);
        };

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
                // dayClick: $scope.alertOnDayClick,
                // eventClick: $scope.alertOnEventClick,
                eventRender: $scope.eventRender,
                dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
                dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                monthNamesShort: ['Th01', 'Th02', 'Th03', 'Th04', 'Th05', 'Th06', 'Th07', 'Th08', 'Th09', 'Th10', 'Th11', 'Th12']
            }
        };

        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventsF];

        // $scope.filePreview = "";
        $scope.uploadNew = function (fileUpload) {
            if (!fileUpload)
                return;
            // $scope.filePreview = fileUpload;

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
                        .then((item)=> {
                            $scope.selectedCustomer.customer.photo = data.data.link;

                        })
                        .catch((error)=>{
                            console.log(error);
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

    }
})();