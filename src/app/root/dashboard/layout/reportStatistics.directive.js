(function () {
    'use strict';

    angular
        .module('ati.root.dashboard')
        .directive('reportStatisticsAdmin', reportStatisticsAdmin)
    ;

    function reportStatisticsAdmin(){
        return {
            restrict: 'E',
            templateUrl: 'root/dashboard/layout/reportStatistics.tpl.html',
            scope:{
                dataStatistics: '=info'
            }
        }
    }
})();