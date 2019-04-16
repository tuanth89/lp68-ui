(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractLaiDungController', ContractLaiDungController);

    function ContractLaiDungController($scope, CONTRACT_STATUS, $timeout, ContractManager, hotRegisterer, Restangular, CONTRACT_EVENT) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.UPDATE_SUCCESS, function () {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

        $scope.getData = () => {
            ContractManager.one('allContract').one('byType').getList("", {
                type: CONTRACT_STATUS.STAND,
                storeId: $scope.$parent.storeSelected.storeId,
                userId: $scope.$parent.storeSelected.userId
            })
                .then((contracts) => {
                    $scope.contracts = angular.copy(Restangular.stripRestangular(contracts));
                })
                .catch((error) => {

                });
        };

        let hotInstance = "";

        $scope.settings = {
            stretchH: "all",
            copyPaste: false,
            autoWrapRow: true,
            // rowHeaders: true,
            colHeaders: true,
            minSpareRows: 0,
            // strict: true
            cells: function (row, col) {
                let cellPrp = {};
                if (col === 1 || col === 2 || col === 8) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('cusRow') >= 0) {
                    let selectedCus = angular.copy($scope.contracts[rowCol.row]);
                    $scope.$parent.getContractsByCus(selectedCus);
                    return;
                }

                if (event.realTarget.className.indexOf('btnStatus') >= 0 && $scope.$parent.storeSelected.userId) {
                    let contractSelected = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = contractSelected;

                    contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                    contractSelected.newPayMoney = 0;

                    contractSelected.totalMoney = contractSelected.moneyContractOld;
                    $scope.$parent.contractSelected = angular.copy(Restangular.stripRestangular(contractSelected));
                    $scope.$apply();

                    $('#dongTienModal').modal('show');

                }
            }
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');
        }, 0);

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (col === 1) {
                // td.innerHTML = '<u><a ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
                td.innerHTML = '<u><a class="linkable cusRow" value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';

            }

            if (col === 2 || col === 8) {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            // if (col === 7) {
            //     td.innerHTML = '<button class="btnStatus btn status-0" value="' + 0 + '">' + 'Đóng' + '</button>';
            // }

        }

        // let date = new Date();
        // let d = date.getDate();
        // let m = date.getMonth();
        // let y = date.getFullYear();
        //
        // // $scope.changeTo = 'English';
        // // $scope.currentView = 'month';
        //
        // /* event source that contains custom events on the scope */
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
        //
        // /* event source that calls a function on every view switch */
        // $scope.eventsF = function (start, end, timezone, callback) {
        //     var s = new Date(start).getTime() / 1000;
        //     var e = new Date(end).getTime() / 1000;
        //     var m = new Date(start).getMonth();
        //     var events = [{
        //         title: 'Feed Me ' + m,
        //         start: s + (50000),
        //         end: s + (100000),
        //         allDay: false,
        //         className: ['customFeed']
        //     }];
        //     callback(events);
        // };
        //
        // $scope.calEventsExt = {
        //     color: '#f00',
        //     textColor: 'yellow',
        //     events: [{
        //         type: 'party',
        //         title: 'Lunch',
        //         start: new Date(y, m, d, 12, 0),
        //         end: new Date(y, m, d, 14, 0),
        //         allDay: false
        //     }, {
        //         type: 'party',
        //         title: 'Lunch 2',
        //         start: new Date(y, m, d, 12, 0),
        //         end: new Date(y, m, d, 14, 0),
        //         allDay: false
        //     }, {
        //         type: 'party',
        //         title: 'Click for Google',
        //         start: new Date(y, m, 28),
        //         end: new Date(y, m, 29),
        //         url: 'http://google.com/'
        //     }]
        // };
        //
        //
        // $scope.ev = {};
        //
        // /* alert on dayClick */
        // $scope.alertOnDayClick = function (date) {
        //     $scope.alertMessage = (date.toString() + ' was clicked ');
        //     $scope.ev = {
        //         from: date.format('YYYY-MM-DD'),
        //         to: date.format('YYYY-MM-DD'),
        //         title: '',
        //         allDay: true
        //     };
        // };
        //
        // /* alert on eventClick */
        // $scope.alertOnEventClick = function (date, jsEvent, view) {
        //     $scope.alertMessage = (date.title + ' was clicked ');
        // };
        //
        // /* add and removes an event source of choice */
        // $scope.addRemoveEventSource = function (sources, source) {
        //     var canAdd = 0;
        //     angular.forEach(sources, function (value, key) {
        //         if (sources[key] === source) {
        //             sources.splice(key, 1);
        //             canAdd = 1;
        //         }
        //     });
        //     if (canAdd === 0) {
        //         sources.push(source);
        //     }
        // };
        //
        // /* Change View */
        // $scope.changeView = function (view, calendar) {
        //     // setTimeout(function () {
        //     $scope.currentView = view;
        //     uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        //     // }, 500);
        //
        // };
        // /* Change View */
        // $scope.renderCalender = function (calendar) {
        //     $timeout(function () {
        //         if (uiCalendarConfig.calendars[calendar]) {
        //             uiCalendarConfig.calendars[calendar].fullCalendar('render');
        //         }
        //     });
        // };
        // /* Render Tooltip */
        // $scope.eventRender = function (event, element, view) {
        // };
        // /* config object */
        // $scope.uiConfig = {
        //     calendar: {
        //         locale: 'vi',
        //         height: 450,
        //         editable: false,
        //         displayEventTime: false,
        //         // customButtons: {
        //         //     myCustomButton: {
        //         //         text: 'custom!',
        //         //         click: function () {
        //         //             alert('clicked the custom button!');
        //         //         }
        //         //     }
        //         // },
        //         header: {
        //             left: 'title',
        //             // center: 'myCustomButton',
        //             right: 'today prev,next'
        //         },
        //         dayClick: $scope.alertOnDayClick,
        //         eventClick: $scope.alertOnEventClick,
        //         eventRender: $scope.eventRender,
        //         // businessHours: {
        //         //     start: '10:00', // a start time (10am in this example)
        //         //     end: '18:00', // an end time (6pm in this example)
        //         //
        //         //     dow: [1, 2, 3, 4]
        //         //     // days of week. an array of zero-based day of week integers (0=Sunday)
        //         //     // (Monday-Thursday in this example)
        //         // },
        //         // monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        //         // dayNamesShort: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
        //         // monthNamesShort: ["Tháng", "Tháng", "Tháng", "Tháng", "Tháng", "Tháng", "Tháng", "Tháng", "Tháng", "Tháng", "Tháng", "Tháng"]
        //         dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
        //         dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        //         monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        //         monthNamesShort: ['Th01', 'Th02', 'Th03', 'Th04', 'Th05', 'Th06', 'Th07', 'Th08', 'Th09', 'Th10', 'Th11', 'Th12']
        //         // weekdaysMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        //
        //     }
        // };
        //
        // /* event sources array*/
        // $scope.eventSources = [$scope.events, $scope.eventsF];

    }
})();