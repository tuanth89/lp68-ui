(function () {
    'use strict';

    angular
        .module('ati.customer')
        .factory('CustomerManager', CustomerManager);

    function CustomerManager(adminRestangular) {
        let RESOURCE_NAME = 'customers';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();