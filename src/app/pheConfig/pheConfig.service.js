(function () {
    'use strict';

    angular
        .module('ati.pheConfig')
        .factory('PheConfigManager', PheConfigManager);

    function PheConfigManager(adminRestangular) {
        let RESOURCE_NAME = 'pheConfigs';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();