(function () {
    'use strict';

    angular
        .module('ati.admin')
        .directive('topSitePublisher', topSitePublisher);

    function topSitePublisher() {
        return {
            restrict: 'E',
            templateUrl: 'admin/dashboard/layout/topSite.tpl.html',
            scope: {
                dataTopStatistics: '=info',
                configTopStatistics: '=config'
            }
        }
    }
})();