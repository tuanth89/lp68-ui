(function () {
    'use strict';

    angular.module('ati.admin', ['ui.router']).run(function ($rootScope, $window, adminRestangular, $http, AdminService) {

        $rootScope.requestUnReadCount = 0;

        $rootScope.newCourseCount = 0;

        $rootScope.checkReaded = function (item) {
            item.read = true;
        }

        $rootScope.markAsRead = function () {
            $rootScope.systemNotifications.list.map(item => {
                item.read = true;
            })
            adminRestangular.all("system-notifications/markAllRead").customPUT().then(function (resp) {

            }).catch(function (err) {

            })
        }

        $rootScope.goToURL = function (item) {
            item.read = true;
            $window.open('#', '_blank');
        }

        $rootScope.init = function () {
            AdminService.init();
        }
    })
})();