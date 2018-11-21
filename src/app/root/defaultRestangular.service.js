(function () {
    'use strict';

    angular
        .module('ati.root')
        .factory('defaultRestangular', defaultRestangular);

    function defaultRestangular(Restangular, API_DEFAULT_BASE_URL) {

        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(API_DEFAULT_BASE_URL);
        });
    }

})();