(function () {
    'use strict';

    angular.module('ati.core.login')
        .config(function ($stateProvider) {
            $stateProvider
                .state('login', {
                    parent: 'anon',
                    url: '/login?lang',
                    controller: 'Login',
                    templateUrl: 'core/login/login.tpl.html',
                    data: {
                        allowAnonymous: true
                    }
                })
            ;
        })
    ;
})();