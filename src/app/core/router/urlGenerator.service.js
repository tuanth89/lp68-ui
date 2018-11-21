(function () {
    'use strict';

    angular.module('ati.core.router')
        .factory('urlPrefixService', urlPrefixService);

    function urlPrefixService(USER_ROLES, BASE_USER_URLS, Auth) {
        var api = {
            getPrefixedUrl: getPrefixedUrl
        };

        return api;

        /////

        function getUrlPrefixForCurrentUser() {
            var urlPrefix = BASE_USER_URLS.root;

            // if (Auth.isAuthorized(USER_ROLES.root)) {
            //     urlPrefix = BASE_USER_URLS.root;
            // } else if (Auth.isAuthorized(USER_ROLES.admin)) {
            //     urlPrefix = BASE_USER_URLS.admin;
            // } else if (Auth.isAuthorized(USER_ROLES.contentManager)) {
            //     urlPrefix = BASE_USER_URLS.contentManager;
            // }

            // return urlPrefix;
        }

        function getPrefixedUrl(url) {
            if (url.indexOf('/') !== 0) {
                url = '/' + url;
            }

            return getUrlPrefixForCurrentUser() + url;
        }
    }
})();