(function () {
    'use strict';

    angular
        .module('ati.admin')
        .directive('topAdNetworkPublisher', topAdNetworkPublisher);

    function topAdNetworkPublisher() {
        return {
            restrict: 'E',
            templateUrl: 'admin/dashboard/layout/topAdNetwork.tpl.html',
            scope: {
                dataTopStatistics: '=info',
                configTopStatistics: '=config'
            }
        }
    }
})();