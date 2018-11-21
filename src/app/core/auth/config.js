(function () {
    'use strict';

    angular.module('ati.core.auth')
        .constant('AUTH_TOKEN_NAME', 'atiToken')
        .constant('PREVIOUS_AUTH_TOKEN_NAME', 'atiPreviousAuthTokenRaw')

        .constant('USER_ROLES', {
            root: 'ROLE_ROOT',
            admin: 'ROLE_ADMIN',
            contentManager: 'ROLE_CONTENT_MANAGER',
            accountant: 'ROLE_ACCOUNTANT',
            customerManager: 'ROLE_CUSTOMER_MANAGER',
            lecturerManager: 'ROLE_LECTURER_MANAGER',
            student: 'ROLE_STUDENT',
            lecturer: 'ROLE_LECTURER',
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