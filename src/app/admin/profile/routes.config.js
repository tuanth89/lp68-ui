(function () {
    'use strict';

    angular
        .module('ati.admin')
        .config(addStates);

    function addStates($stateProvider) {
        $stateProvider
            .state({
                name: 'app.admin.profile',
                abstract: true,
                url: '/profile'
            })

            .state({
                name: 'app.admin.profile.edit',
                url: '/edit',
                views: {
                    'content@app': {
                        controller: 'AdminProfileForm',
                        templateUrl: 'admin/profile/adminForm.tpl.html'
                    }
                },
                resolve: {
                    admin: function (AdminManager, userSession) {
                        return AdminManager.one(userSession.username).get();
                    }
                },
                ncyBreadcrumb: {
                    label: '{{ "EDIT_PROFILE" | translate }}'
                }
            });
    }
})();