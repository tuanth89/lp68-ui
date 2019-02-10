(function () {
    'use strict';

    angular
        .module('ati.admin')
        .config(addRoutes);

    function addRoutes($stateProvider) {
        $stateProvider
            .state('app.admin.dashboard', {
                url: '/dashboard',
                views: {
                    'content@app': {
                        controller: 'AdminDashboard',
                        templateUrl: 'admin/dashboard/dashboard.tpl.html'
                    }
                },
                resolve: {
                    dashboard: function (Restangular) {
                        return Restangular.all("admins").one("dashboard").get();
                    }
                },
                ncyBreadcrumb: {
                    label: 'Dashboard'
                }
            });

    }
})();