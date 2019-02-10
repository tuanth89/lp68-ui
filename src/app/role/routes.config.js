(function () {
    'use strict';

    angular.module('ati.admin')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('role', {
                abstract: true,
                url: '/roles'
            })
            .state('role.list', {
                url: '/list?search',
                views: {
                    'content@app': {
                        controller: 'RoleController',
                        templateUrl: 'role/roleList.tpl.html'
                    }
                },
            }).state('role.new', {
                url: '/new',
                views: {
                    'content@app': {
                        controller: 'RoleController',
                        templateUrl: 'role/roleForm.tpl.html'
                    }
                }
            }).state('role.edit', {
                url: '/edit/:friendlyName?groupName',
                views: {
                    'content@app': {
                        controller: 'RoleController',
                        templateUrl: 'role/roleForm.tpl.html'
                    }
                }
            });
    }
})();