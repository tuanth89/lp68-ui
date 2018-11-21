(function () {
    'use strict';

    angular
        .module('ati.admin')
        .directive('averageStatisticsPublisher', averageStatisticsPublisher);

    function averageStatisticsPublisher() {
        return {
            restrict: 'E',
            templateUrl: 'admin/dashboard/layout/averageStatistics.tpl.html',
            scope: {
                dataAverage: '=info'
            }
        }
    }
})();