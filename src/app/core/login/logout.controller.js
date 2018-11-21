(function () {
    'use strict';

    angular.module('ati.core.login')
        .controller('Logout', Logout)
    ;

    function Logout($rootScope, $scope, Auth, AUTH_EVENTS, LANG_KEY) {
        var lang = window.localStorage[LANG_KEY];

        $scope.logout = function() {
            Auth.logout();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, lang);
        };
    }
})();