(function () {
    'use strict';

    angular.module('ati.core.auth')
        .factory('sessionStorage', sessionStorage)
    ;

    function sessionStorage($window, AUTH_TOKEN_NAME, PREVIOUS_AUTH_TOKEN_NAME, SELECTED_STORE_ID, SELECTED_USER_ID, SELECTED_USER_CODE, SELECTED_USER_NAME, SELECTED_STORE_NAME) {
        var api = {
            setStoreId: setStoreId,
            getStoreId: getStoreId,

            setStoreName: setStoreName,
            getStoreName: getStoreName,

            setUserByStoreCode: setUserByStoreCode,
            getUserByStoreCode: getUserByStoreCode,

            setUserByStoreName: setUserByStoreName,
            getUserByStoreName: getUserByStoreName,

            setUserByStoreId: setUserByStoreId,
            getUserByStoreId: getUserByStoreId,

            setCurrentToken: setCurrentToken,
            getCurrentToken: getCurrentToken,

            setPreviousToken: setPreviousToken,
            getPreviousToken: getPreviousToken,

            clearStorage: clearStorage,
            clearPreviousToken: clearPreviousToken
        };

        //

        return api;

        function setUserByStoreName(userName) {
            $window.localStorage[SELECTED_USER_NAME] = userName;
        }

        function getUserByStoreName() {
            return $window.localStorage[SELECTED_USER_NAME];
        }

        function setUserByStoreCode(userCode) {
            $window.localStorage[SELECTED_USER_CODE] = userCode;
        }

        function getUserByStoreCode() {
            return $window.localStorage[SELECTED_USER_CODE];
        }

        function setUserByStoreId(userId) {
            $window.localStorage[SELECTED_USER_ID] = userId;
        }

        function getUserByStoreId() {
            return $window.localStorage[SELECTED_USER_ID];
        }

        function setStoreId(storeId) {
            $window.localStorage[SELECTED_STORE_ID] = storeId;
        }

        function getStoreId() {
            return $window.localStorage[SELECTED_STORE_ID];
        }

        function setStoreName(storeName) {
            $window.localStorage[SELECTED_STORE_NAME] = storeName;
        }

        function getStoreName() {
            return $window.localStorage[SELECTED_STORE_NAME];
        }

        function setCurrentToken(CurrentAuthToken) {
            $window.localStorage[AUTH_TOKEN_NAME] = CurrentAuthToken;
        }

        function getCurrentToken() {
            return $window.localStorage[AUTH_TOKEN_NAME];
        }

        function setPreviousToken(previousAuthToken) {
            $window.localStorage[PREVIOUS_AUTH_TOKEN_NAME] = previousAuthToken;
        }

        function getPreviousToken() {
            return $window.localStorage[PREVIOUS_AUTH_TOKEN_NAME];
        }

        function clearStorage() {
            $window.localStorage.clear();
        }

        function clearPreviousToken() {
            $window.localStorage.removeItem(PREVIOUS_AUTH_TOKEN_NAME);
        }
    }
})();