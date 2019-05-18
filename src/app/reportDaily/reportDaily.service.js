(function () {
    'use strict';

    angular
        .module('ati.reportDaily')
        .factory('ReportDailyManager', ReportDailyManager);

    function ReportDailyManager(adminRestangular) {
        let RESOURCE_NAME = 'reportDaily';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();