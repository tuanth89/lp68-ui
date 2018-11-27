(function () {
    'use strict';

    angular
        .module('ati.contract')
        .factory('ContractManager', ContractManager);

    function ContractManager(Restangular) {
        let RESOURCE_NAME = 'contracts';

        return Restangular.service(RESOURCE_NAME);
    }

})();