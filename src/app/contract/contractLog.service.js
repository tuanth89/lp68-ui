(function () {
    'use strict';

    angular
        .module('ati.contract')
        .factory('ContractLogManager', ContractLogManager);

    function ContractLogManager(adminRestangular) {
        let RESOURCE_NAME = 'contractLogs';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();