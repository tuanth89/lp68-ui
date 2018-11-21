(function () {
    'use strict';

    angular
        .module('ati.admin')
        .directive('reportStatisticsPublisher', reportStatisticsPublisher);

    function reportStatisticsPublisher() {
        return {
            restrict: 'E',
            templateUrl: 'admin/dashboard/layout/reportStatistics.tpl.html',
            scope: {
                dataStatistics: '=info'
            }
        }
    }
})();