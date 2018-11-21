(function () {
    'use strict';

    angular
        .module('ati.adminManagement')
        .factory('RoleManager', RoleManager)
    ;

    function RoleManager(adminRestangular) {
        let RESOURCE_NAME = 'roots';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();