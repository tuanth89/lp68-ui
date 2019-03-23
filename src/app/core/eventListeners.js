(function () {
    'use strict';

    angular.module('ati.core')
        .run(eventListeners);

    function eventListeners($rootScope, $translate, $state, AUTH_EVENTS, RELOAD_PAGE, ENTRY_STATE, AlertService, UserStateHelper, Auth, AdminService) {
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            UserStateHelper.transitionRelativeToBaseState('.dashboard');

            // AdminService.init();

            // if(Auth.isRoot()) {
            // } else if (Auth.isAdmin()) {
            //     UserStateHelper.transitionRelativeToBaseState('.dashboard');
            // } else {
            //     UserStateHelper.transitionRelativeToBaseState('admin.management.doctorVisit.todayWorkList');
            // }
        });

        $rootScope.$on(RELOAD_PAGE.CHANGE_STORE_OR_STAFF, function () {
            UserStateHelper.transitionRelativeToBaseState('.dashboard');
        });

        $rootScope.$on(AUTH_EVENTS.loginFailed, function () {
            AlertService.replaceAlerts({
                type: 'error',
                message: $translate.instant('EVENT_LISTENER.LOGIN_FAIL')
            });
        });

        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event, lang) {
            $state.go(ENTRY_STATE, {
                lang: lang
            }).then(function () {
                AlertService.replaceAlerts({
                    message: $translate.instant('EVENT_LISTENER.LOGOUT_SUCCESS')
                });
            });
        });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            $state.go(ENTRY_STATE);
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            $state.go(ENTRY_STATE).then(function () {
                AlertService.replaceAlerts({
                    type: 'error',
                    message: $translate.instant('EVENT_LISTENER.SESSION_EXPIRED')
                });
            });
        });

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function () {
            // //console.log('not authorized');
            UserStateHelper.transitionRelativeToBaseState('error.403');
        });
    }
})();