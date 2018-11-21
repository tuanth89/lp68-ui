(function () {
    'use strict';

    angular
        .module('ati.adminManagement')
        .factory('AdminManager', AdminManager)
    ;

    function AdminManager(adminRestangular) {
        let RESOURCE_NAME = 'admins';

        return adminRestangular.service(RESOURCE_NAME);
    }

})();