(function () {
    'use strict';

    angular
        .module('ati.root.dashboard')
        .directive('topStatisticsAdmin', topStatisticsAdmin)
    ;

    function topStatisticsAdmin(){
        return {
            restrict: 'E',
            templateUrl: 'root/dashboard/layout/topStatistics.tpl.html',
            scope: {
                dataTopStatistics: '=info',
                configTopStatistics: '=config'
            }
        }
    }
})();