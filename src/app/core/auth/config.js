(function () {
    'use strict';

    angular.module('ati.core.auth')
        .constant('AUTH_TOKEN_NAME', 'atiToken')
        .constant('PREVIOUS_AUTH_TOKEN_NAME', 'atiPreviousAuthTokenRaw')
        .constant('SELECTED_STORE_ID', 'selectedStoreId')

        .constant('USER_ROLES', {
            root: 'super-admin'
        })

        .constant('AUTH_EVENTS', {
            loginSuccess: 'ati.core.auth.login_success',
            loginFailed: 'ati.core.auth.login_failed',
            logoutSuccess: 'ati.core.auth.logout_success',
            sessionTimeout: 'ati.core.auth.session_timeout',
            notAuthenticated: 'ati.core.auth.not_authenticated',
            notAuthorized: 'ati.core.auth.not_authorized'
        })

    ;

})();