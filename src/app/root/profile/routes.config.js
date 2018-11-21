(function () {
    'use strict';

    angular
        .module('ati.root.profile')
        .config(addStates)
    ;

    function addStates($stateProvider) {
        $stateProvider
            .state({
                name: 'app.root.profile',
                abstract: true,
                url: '/profile'
            })

            .state({
                name: 'app.root.profile.edit',
                url: '/edit',
                views: {
                    'content@app': {
                        controller: 'RootProfileForm',
                        templateUrl: 'root/profile/rootForm.tpl.html'
                    }
                },
                resolve: {
                    admin: function(RoleManager, userSession) {
                        return RoleManager.one(userSession.username).get();
                    }
                },
                ncyBreadcrumb: {
                    label: '{{ "EDIT_PROFILE" | translate }}'
                }
            })
        ;
    }
})();