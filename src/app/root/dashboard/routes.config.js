(function () {
    'use strict';

    angular
        .module('ati.root.dashboard')
        .config(addStates)
        ;

    function addStates($stateProvider) {
        $stateProvider.state('app.root.dashboard', {
            url: '/dashboard?{startDate}&{endDate}',
            views: {
                'content@app': {
                    controller: 'AdminDashboard',
                    templateUrl: 'admin/dashboard/dashboard.tpl.html'
                }
            },
            resolve: {
                // results: function (AdminManager, userSession) {
                //     return AdminManager.one(userSession.username).getList("dashboard");
                // }
            },
            ncyBreadcrumb: {
                label: 'Dashboard'
            }
        });
    }
})();