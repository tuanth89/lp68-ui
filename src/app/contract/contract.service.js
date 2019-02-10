(function () {
    'use strict';

    angular
        .module('ati.contract')
        .factory('ContractManager', ContractManager);

    function ContractManager(adminRestangular) {
        let RESOURCE_NAME = 'contracts';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();