(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CalendarTestController', CalendarTestController);

    function CalendarTestController($scope, $stateParams, $timeout, $state, uiCalendarConfig) {

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'Hungarian';
        $scope.currentView = 'agendaWeek';

        /* event source that contains custom events on the scope */
        $scope.events = [{
            title: 'All Day Event',
            start: new Date(y, m, 1),
            stick: true,
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2),
            stick: true
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d - 3, 16, 0),
            allDay: false,
            stick: true
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16, 0),
            allDay: false,
            stick: true
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false,
            stick: true
        }, {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/',
            stick: true
        }];

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

        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            events: [{
                type: 'party',
                title: 'Lunch',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false
            }, {
                type: 'party',
                title: 'Lunch 2',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false
            }, {
                type: 'party',
                title: 'Click for Google',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                url: 'http://google.com/'
            }]
        };

        $scope.ev = {};

        /* alert on dayClick */
        $scope.alertOnDayClick = function (date) {
            $scope.alertMessage = (date.toString() + ' was clicked ');
            $scope.ev = {
                from: date.format('YYYY-MM-DD'),
                to: date.format('YYYY-MM-DD'),
                title: '',
                allDay: true
            };
        };

        /* alert on eventClick */
        $scope.alertOnEventClick = function (date, jsEvent, view) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };
        /* alert on Drop */
        $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function (sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function (value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
        /* add custom event*/
        $scope.addEvent = function () {
            $scope.events.push({
                title: $scope.ev.title,
                start: moment($scope.ev.from),
                end: moment($scope.ev.to),
                allDay: true,
                className: ['openSesame']
            });
        };
        /* remove event */
        /*$scope.remove = function (index) {
         $scope.events.splice(index, 1);
         };*/
        /* Change View */
        $scope.changeView = function (view, calendar) {
            $scope.currentView = view;
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        $scope.renderCalender = function (calendar) {
            $timeout(function () {
                if (uiCalendarConfig.calendars[calendar]) {
                    uiCalendarConfig.calendars[calendar].fullCalendar('removeEvents');

                    uiCalendarConfig.calendars[calendar].fullCalendar('render');
                    uiCalendarConfig.calendars[calendar].fullCalendar('addEventSource', $scope.eventSources);

                }
            });
        };
        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                customButtons: {
                    myCustomButton: {
                        text: 'custom!',
                        click: function () {
                            alert('clicked the custom button!');
                        }
                    }
                },
                header: {
                    left: 'title',
                    center: 'myCustomButton',
                    right: 'today prev,next'
                },
                defaultView: 'basicWeek',
                dayClick: $scope.alertOnDayClick,
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender,
                businessHours: {
                    start: '10:00', // a start time (10am in this example)
                    end: '18:00', // an end time (6pm in this example)

                    dow: [1, 2, 3, 4]
                    // days of week. an array of zero-based day of week integers (0=Sunday)
                    // (Monday-Thursday in this example)
                },
                eventSources: [$scope.events, $scope.eventsF]
            }
        };

        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventsF];

    }
})();