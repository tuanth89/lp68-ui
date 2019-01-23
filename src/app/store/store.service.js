(function () {
    'use strict';

    angular
        .module('ati.customer')
        .factory('StoreManager', StoreManager);

    function StoreManager(Restangular) {
        let RESOURCE_NAME = 'stores';

        return Restangular.service(RESOURCE_NAME);
    }

})();