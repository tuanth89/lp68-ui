(function () {
    'use strict';

    angular
        .module('ati.contract')
        .factory('HdLuuThongManager', HdLuuThongManager);

    function HdLuuThongManager(adminRestangular) {
        let RESOURCE_NAME = 'hdLuuThongs';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();