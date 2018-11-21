(function () {
    'use strict';

    angular
        .module('ati.root.dashboard')
        .directive('averageStatisticsAdmin', averageStatisticsAdmin)
    ;

    function averageStatisticsAdmin()
    {
        return {
            restrict: 'E',
            templateUrl: 'root/dashboard/layout/averageStatistics.tpl.html',
            scope:{
                dataAverage: '=info'
            }
        }
    }
})();