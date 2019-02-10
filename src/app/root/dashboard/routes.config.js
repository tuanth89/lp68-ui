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
                    controller: 'RootDashboard',
                    templateUrl: 'root/dashboard/dashboard.tpl.html'
                }
            },
            resolve: {
                dashboard: function (AdminManager) {
                    return AdminManager.one("dashboard").get();
                }
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