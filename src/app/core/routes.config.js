(function () {
    'use strict';

    angular.module('ati.core')
        .config(addRoutes)
    ;

    function addRoutes($stateProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');
        $stateProvider
            // all states should inherit from root
            // we can ensure that the current user has a valid session status
            .state('app', {
                abstract: true,
                templateUrl: 'core/layout/app.tpl.html',
                controller: 'AppController',
                resolve: {
                    userSession: function(Auth) {
                        return Auth.getSession();
                    },
                    storeList: function(StoreManager) {
                        return StoreManager.one("listForUser").getList();
                    }
                },
                ncyBreadcrumb: {
                    skip: true
                }
            })

            .state('anon', {
                abstract: true,
                templateUrl: 'core/layout/anon.tpl.html',
                ncyBreadcrumb: {
                    skip: true
                }
            })
        ;
    }
})();
