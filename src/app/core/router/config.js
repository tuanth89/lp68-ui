(function () {
    'use strict';

    angular.module('ati.core.router')
        .config(appConfig)

        .constant('BASE_USER_URLS', {
            root: '/root',
            admin: '/admin',
            contentManager: '/content-manager',
            accountManager: '/accountant',
            customerManager: '/customer-manager',
        })

        .constant('BASE_USER_STATES', {
            root: 'app.root',
            admin: 'app.admin',
            contentManager: 'app.contentManager',
            accountantManager: 'app.accountant',
            customerManager: 'app.customerManager',
            lecturerManager: 'app.lecturerManager',
        });

    function appConfig($urlRouterProvider) {
        $urlRouterProvider.when('', '/');

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var path = $location.path();

            return $injector.invoke( /* @ngInject */ function (Auth, urlPrefixService) {
                if (!Auth.isAuthenticated()) {
                    return '/login';
                }

                if (path === '/') {
                    return "/admin/dashboard";
                }

                // if (path === '/' && !Auth.isAdmin()) {
                //     if(Auth.isClinic()) {
                //         return urlPrefixService.getPrefixedUrl('/usersManagement/doctors/list');
                //     }
                //
                //     return urlPrefixService.getPrefixedUrl('/management/doctorVisit/todayWorkboard');
                // }

                // if (path === '/') {
                //     return urlPrefixService.getPrefixedUrl('/dashboard');
                // }

                // if (path === '/' && Auth.isAdmin()) {
                //     return urlPrefixService.getPrefixedUrl('/dashboard');
                // }

                // if (path === '/' && Auth.isContentManager()) {
                //     return urlPrefixService.getPrefixedUrl('/dashboard');
                // }

                // return urlPrefixService.getPrefixedUrl('/error/404');
            });
        });
    }
})();