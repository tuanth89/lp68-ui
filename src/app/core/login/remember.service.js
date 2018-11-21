(function () {
    'use strict';

    angular.module('ati.core.login')
        .factory('rememberMeService', function () {

        function fetchValue(name) {
            let gCookieVal = document.cookie.split("; ");
            for (let i = 0; i < gCookieVal.length; i++) {
                // a name/value pair (a crumb) is separated by an equal sign
                let gCrumb = gCookieVal[i].split("=");
                if (name === gCrumb[0]) {
                    let value = '';
                    try {
                        value = angular.fromJson(gCrumb[1]);
                    } catch (e) {
                        value = unescape(gCrumb[1]);
                    }
                    return value;
                }
            }
            // a cookie with the requested name does not exist
            return null;
        }

        return function (name, values) {
            if (arguments.length === 1) return fetchValue(name);
            let cookie = name + '=';
            if (typeof values === 'object') {
                let expires = '';
                cookie += (typeof values.value === 'object') ? angular.toJson(values.value) + ';' : values.value + ';';
                if (values.expires) {
                    let date = new Date();
                    date.setTime(date.getTime() + (values.expires * 24 * 60 * 60 * 1000));
                    expires = date.toGMTString();
                }
                cookie += (!values.session) ? 'expires=' + expires + ';' : '';
                cookie += (values.path) ? 'path=' + values.path + ';' : '';
                cookie += (values.secure) ? 'secure;' : '';
            } else {
                cookie += values + ';';
            }
            document.cookie = cookie;
        }
    });
})();