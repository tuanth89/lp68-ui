(function () {
    'use strict';

    angular
        .module('ati.admin')
        .config(addRoutes);

    function addRoutes($stateProvider) {
        $stateProvider
            .state('app.admin.dashboard', {
                url: '/dashboard?{startDate}&{endDate}',
                views: {
                    'content@app': {
                        controller: 'AdminDashboard',
                        templateUrl: 'admin/dashboard/dashboard.tpl.html'
                    }
                },
                resolve: {
                    results: function (AdminManager, userSession) {
                        // return AdminManager.oneone(userSession.username).getList("dashboard");
                        return [];
                    }
                },
                ncyBreadcrumb: {
                    label: 'Dashboard'
                }
            });
    }
})();