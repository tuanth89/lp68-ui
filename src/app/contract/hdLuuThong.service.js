(function () {
    'use strict';

    angular
        .module('ati.contract')
        .factory('HdLuuThong', HdLuuThong);

    function HdLuuThong(adminRestangular) {
        let RESOURCE_NAME = 'hdLuuThongs';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();