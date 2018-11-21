(function () {
    'use strict';

    angular.module('ati.core.auth')
        .factory('autoLogin', autoLogin)
    ;

    function autoLogin($state, Auth, sessionStorage) {
        var api = {
            switchToUser: switchToUser,
            switchBackMyAccount: switchBackMyAccount,
            showButtonSwitchBack: showButtonSwitchBack
        };

        //

        return api;

        /**
         *
         * @param userToken
         * @param homeState
         * @returns {promise}
         */
        function switchToUser(userToken, homeState) {
            sessionStorage.setPreviousToken(angular.toJson(Auth.getSession()) || {});

            if(!!userToken.doctor) {
                userToken = {
                    token: userToken.doctor,
                    id: userToken.doctor.id,
                    username: userToken.doctor.username,
                    userRoles: ["ROLE_USER"]
                };
            }

            var newSession = Auth.initSession(userToken);
            sessionStorage.setCurrentToken(newSession.token);

            var transition = $state.transitionTo(homeState, {}, {
                reload: true,
                inherit: false,
                notify: true
            });

            return transition;
        }

        function switchBackMyAccount(homeState) {
            var previousAuthToken = angular.fromJson(sessionStorage.getPreviousToken());

            switchToUser(previousAuthToken, homeState).then(function() {
                sessionStorage.clearPreviousToken();
            });
        }

        function showButtonSwitchBack() {
            return sessionStorage.getPreviousToken() != {} && sessionStorage.getPreviousToken() != undefined;
        }
    }
})();