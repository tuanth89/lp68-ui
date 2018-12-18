(function () {
    'use strict';

    angular
        .module('ati.contract')
        .factory('ContractLogManager', ContractLogManager);

    function ContractLogManager(Restangular) {
        let RESOURCE_NAME = 'contractLogs';

        return Restangular.service(RESOURCE_NAME);
    }

})();