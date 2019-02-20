(function () {
    'use strict';

    angular.module('ati.core.auth')
        .constant('authErrors', {
            noToken: 'no token',
            invalidToken: 'invalid token',
            invalidTokenResponse: 'invalid token response',
            missingRequiredUserRole: 'not authorized, missing user role',
            missingRequiredModule: 'not authorized, missing module'
        })
        .factory('Auth', auth);

    function auth($http, $q, API_BASE_URL, USER_ROLES, authErrors, sessionFactory, sessionStorage) {
        var api = {
            initSession: initSession,
            login: login,
            logout: logout,
            check: check,
            setSession: _setSession,
            getSession: getSession,
            setSessionPropery: setSessionPropery,
            setSessionPropertyStoreId: setSessionProperty_StoreId,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            getAuthorizationHeaderValue: getAuthorizationHeaderValue,
            isAccountant: isAccountant,
            isRoot: isRoot
        };

        ////////////////////////

        var _$currentSession = null;
        var _$persistToken = false;

        function _processTokenResponse(response) {
            if (!_verifyTokenResponse(response.data)) {
                return $q.reject(new Error(authErrors.invalidTokenResponse));
            }

            return response.data;
        }

        function _verifyTokenResponse(result) {
            return angular.isObject(result) &&
                result.hasOwnProperty('token') &&
                result.hasOwnProperty('id') &&
                result.hasOwnProperty('userRoles');
            // result.hasOwnProperty('username') &&
        }

        /**
         * @param {Object} data
         */
        function _createSession(data) {
            if (!angular.isObject(data)) {
                throw new Error('cannot create a session, expecting an object');
            }

            var session = sessionFactory.createNewFrom(data);

            _setSession(session);

            return session;
        }

        function _setSession(session) {
            if (!sessionFactory.isSession(session)) {
                throw new Error('that is a not a valid session object');
            }

            // this is a closure variable
            _$currentSession = session;

            // //console.log('session written');
        }

        /**
         *
         * @param {Object} data
         * @returns {Object|Boolean}
         */
        function initSession(data) {
            try {
                return _createSession(data);
            } catch (e) {
                return false;
            }
        }

        /**
         *
         * @param {Object} credentials
         * @param {Boolean} rememberMe
         * @returns {promise}
         */
        function login(credentials, rememberMe) {
            return $http
                .post(API_BASE_URL + '/getToken', credentials, {
                    ignoreLoadingBar: true
                })
                .then(_processTokenResponse)
                .then(function (data) {
                    var session = _createSession(data);

                    _$persistToken = !!rememberMe;

                    if (_$persistToken) {
                        sessionStorage.setCurrentToken(session.token);
                    }

                    return session;
                })
                // .catch(function (e) {
                //     // handle errors in processing or in error.
                // });
                ;
        }

        /**
         * Checks if the saved token is valid
         *
         * @returns {promise}
         */
        function check() {
            var dfd = $q.defer();

            var token = sessionStorage.getCurrentToken();
            let selectedStoreId = sessionStorage.getStoreId();

            if (!token) {
                dfd.reject(new Error(authErrors.noToken));
                return dfd.promise;
            }

            $http.post(API_BASE_URL + '/checkToken', {}, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': getAuthorizationHeaderValue(token)
                }
            })
                .then(
                    function (response) {
                        let data = response.data;

                        // use existing token
                        data.token = token;
                        // use selected storeId
                        data.selectedStoreId = selectedStoreId;

                        dfd.resolve(data);
                    },
                    function () {
                        sessionStorage.clearStorage();
                        dfd.reject(new Error(authErrors.invalidToken));
                    }
                );

            return dfd.promise;
        }

        function logout() {
            var favicon = localStorage.getItem("favicon") ? localStorage.getItem("favicon") : null;
            _$currentSession = null;
            sessionStorage.clearStorage();
            localStorage.setItem("favicon", favicon);
        }

        function getSession() {
            if (isAuthenticated()) {
                return angular.copy(_$currentSession);
            }

            return false;
        }

        function setSessionPropery(name, photo) {
            if (isAuthenticated()) {
                _$currentSession.name = name;
                _$currentSession.photo = photo;
            }
        }

        function setSessionProperty_StoreId(storeId) {
            if (isAuthenticated()) {
                _$currentSession.selectedStoreId = storeId;
                sessionStorage.setStoreId(storeId);
            }
        }

        function isAuthenticated() {
            return !!_$currentSession && sessionFactory.isSession(_$currentSession);
        }

        function isAuthorized(role) {
            return isAuthenticated() && _$currentSession.hasUserRole(role);
        }

        function getAuthorizationHeaderValue(token) {
            if (angular.isString(token)) {
                return 'Bearer ' + token;
            }

            return null;
        }

        // function isAdmin() {
        //     // If the admin is currently logged in as a content manager
        //     // they will have a previous token set
        //     return isAuthorized(USER_ROLES.root) && !sessionStorage.getPreviousToken();
        // }

        function isAccountant() {
            return isAuthenticated() && _$currentSession.hasRoleAccountant();
        }

        function isRoot() {
            // If the super admin is currently logged in as a content manager
            // they will have a previous token set
            return isAuthorized(USER_ROLES.root) && !sessionStorage.getPreviousToken();
        }

        return api;
    }
})();