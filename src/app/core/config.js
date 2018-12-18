(function () {
    'use strict';

    angular.module('ati.core')
        .constant('ENTRY_STATE', 'login')
        .config(config)
        .constant('CONTRACT_STATUS', {
            NEW: 0,
            MATURITY: 1,
            COLLECT: 2,
            CLOSE_DEAL: 3,
            ESCAPE: 4,
            END: 5
        })
        .constant('SPECIAL_CHARACTER_PATTERN', /[`~<>:"/[\]|{}()=+]/)
    ;

    function config($httpProvider) {
        $httpProvider.interceptors.push('authTokenInterceptor');
        $httpProvider.interceptors.push('responseErrorInterceptor');
    }
})();