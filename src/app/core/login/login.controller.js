(function () {
    'use strict';

    angular.module('ati.core.login')
        .controller('Login', Login);

    function Login($scope, $translate, $stateParams, $rootScope, rememberMeService, AUTH_EVENTS, Auth, LANG_KEY) {
        $scope.credentials = {
            username: '',
            password: ''
        };
        $rootScope.favicon = localStorage.getItem("favicon") ? localStorage.getItem("favicon"): null;
        if ($stateParams.lang == 'vi' || $stateParams.lang == 'en') {
            window.localStorage[LANG_KEY] = $stateParams.lang;
            $translate.use(window.localStorage[LANG_KEY]);
        }

        $scope.lang = window.localStorage[LANG_KEY];
        $scope.frontPageEndPoint = window.location.protocol + '//' + window.location.host.replace('platform.', '');

        $scope.isFormValid = function () {
            return $scope.loginForm.$valid;
        };

        $scope.formProcessing = false;

        let username = rememberMeService('7ZXYZ@L'),
            password = rememberMeService('UU@#90');
        if (username && password) {
            $scope.remember = true;
            $scope.credentials.username = atob(username);
            $scope.credentials.password = atob(password);
        }

        $scope.rememberMe = function () {
            if (!$scope.remember) {
                rememberMeService('7ZXYZ@L', btoa($scope.credentials.username));
                rememberMeService('UU@#90', btoa($scope.credentials.password));
            } else {
                rememberMeService('7ZXYZ@L', '');
                rememberMeService('UU@#90', '');
            }
        };

        $scope.login = function (credentials) {
            if ($scope.formProcessing) {
                return;
            }

            $scope.formProcessing = true;

            Auth.login(credentials, true)
                .then(
                    function () {
                        // if (!Auth.isRoot() && !Auth.isAdmin() && !Auth.isAccountant() &&
                        //     !Auth.isContentManager() && !Auth.isCustomerManager() && !Auth.isLecturerManager()) {
                        //     $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        // } else {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        // }
                    },
                    function (error) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    }
                )
                .finally(function () {
                    $scope.formProcessing = false;
                });
        };
    }
})();