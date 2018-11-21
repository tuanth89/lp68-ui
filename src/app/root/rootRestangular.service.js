(function () {
    'use strict';

    angular
        .module('ati.root')
        .factory('rootRestangular', rootRestangular)
        ;

    function rootRestangular(Restangular, API_ADMIN_BASE_URL) {

        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(API_ADMIN_BASE_URL);
        });
    }

})();