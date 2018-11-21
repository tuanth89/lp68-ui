(function() {
    'use strict';

    angular.module('ati.core')
        .factory('responseErrorInterceptor', responseInterceptor)
    ;

    function responseInterceptor($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: responseError
        };

        /////

        function responseError(rejection) {
            //console.log('response error!');

            if(rejection.status == 403) {
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else if(rejection.status == 401) {
                $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout);
            }

            return $q.reject(rejection);
        }
    }
})();