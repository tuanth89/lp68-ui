(function () {
    'use strict';

    angular
        .module('ati.customer')
        .factory('StoreManager', StoreManager);

    function StoreManager(adminRestangular) {
        let RESOURCE_NAME = 'stores';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();