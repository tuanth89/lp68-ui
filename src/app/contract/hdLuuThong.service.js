(function () {
    'use strict';

    angular
        .module('ati.contract')
        .factory('HdLuuThong', HdLuuThong);

    function HdLuuThong(Restangular) {
        let RESOURCE_NAME = 'hdLuuThongs';

        return Restangular.service(RESOURCE_NAME);
    }

})();