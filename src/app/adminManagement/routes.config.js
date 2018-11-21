(function () {
    'use strict';

    angular.module('ati.adminManagement')
        .config(addStates);

    function addStates(UserStateHelperProvider, USER_ROLES) {
        UserStateHelperProvider.state('adminManagement', {
                abstract: true,
                url: '/admin',
                ncyBreadcrumb: {
                    skip: true
                },
                data: {
                    requiredUserRole: USER_ROLES.root
                },
            })
            .state('adminManagement.list', {
                url: '/list?page&sortField&orderBy&search',
                views: {
                    'content@app': {
                        controller: 'AdminList',
                        templateUrl: 'adminManagement/adminList.tpl.html'
                    }
                },
                resolve: {
                    admins: function (AdminManager) {
                        return AdminManager.getList();
                    }
                },
                // ncyBreadcrumb: {
                //     label: '{{ "NAV_MODULE.ASSISTANTS" | translate }}'
                // },
                // reloadOnSearch: false
            })

            .state('adminManagement.new', {
                url: '/new',
                views: {
                    'content@app': {
                        controller: 'AdminForm',
                        templateUrl: 'adminManagement/adminForm.tpl.html'
                    }
                },
                resolve: {
                    admin: function () {
                        return null;
                    },
                    admins: function (AdminManager) {
                        return AdminManager.getList();
                    }
                },
                // customResolve: {
                //     admin: {
                //         doctors: /* @ngInject */ function(doctorRestangular) {
                //             return doctorRestangular.one('doctors').getList();
                //         }
                //     }
                // },
                // ncyBreadcrumb: {
                //     label: '{{ "ASSISTANT_MODULE.NEW_ASSISTANT" | translate }}'
                // }
            })

            .state({
                name: 'adminManagement.edit',
                url: '/edit/:id',
                views: {
                    'content@app': {
                        controller: 'AdminForm',
                        templateUrl: 'adminManagement/adminForm.tpl.html'
                    }
                },
                resolve: {
                    admin: function ($stateParams, UserManager) {
                        return UserManager.one($stateParams.id).get();
                    },
                    admins: function (AdminManager) {
                        return AdminManager.getList();
                    }
                },
                // customResolve: {
                //     admin: {
                //         doctors: /* @ngInject */ function(doctorRestangular) {
                //             return doctorRestangular.one('doctors').getList();
                //         }
                //     }
                // },
                // ncyBreadcrumb: {
                //     label: '{{ "ASSISTANT_MODULE.EDIT_ASSISTANT" | translate }} - {{ assistant.username }}'
                // }
            });
    }
})();