(function () {
    'use strict';

    angular
        .module('ati.customer')
        .factory('CustomerManager', CustomerManager);

    function CustomerManager(Restangular) {
        let RESOURCE_NAME = 'customers';

        return Restangular.service(RESOURCE_NAME);
    }

})();