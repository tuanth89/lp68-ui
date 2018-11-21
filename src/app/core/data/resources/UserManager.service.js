(function () {
    'use strict';

    angular.module('ati.core.data.resources')
        .factory('UserManager', UserManager)
        ;

    function UserManager(Restangular) {
        var RESOURCE_NAME = 'users';

        return Restangular.service(RESOURCE_NAME);
    }
})();