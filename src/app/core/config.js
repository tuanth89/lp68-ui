(function () {
    'use strict';

    angular.module('ati.core')
        .constant('ENTRY_STATE', 'login')
        .config(config)
        .constant('CONTRACT_STATUS', {
            NEW: 0,
            MATURITY: 1,
            STAND: 2,
            COLLECT: 3,
            CLOSE_DEAL: 4,
            ESCAPE: 5,
            END: 6,
            MATURITY_END: 7,
            ACCOUNTANT_END: 8
        })
        .constant('IMGUR_API', {
            URL: 'https://api.imgur.com/3/image',
            CLIENT_ID: 'Client-ID 5039840147cebbb'
        })
        .constant('IMGUR_CLIENT_ID', 'Client-ID 5039840147cebbb')
        .constant('CONTRACT_EVENT', {
            UPDATE_SUCCESS: 'UPDATE_SUCCESS'
        })
    ;

    function config($httpProvider) {
        $httpProvider.interceptors.push('authTokenInterceptor');
        $httpProvider.interceptors.push('responseErrorInterceptor');
    }
})();