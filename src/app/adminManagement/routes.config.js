(function () {
    'use strict';

    angular.module('ati.adminManagement')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider.state('adminManagement', {
            abstract: true,
            url: '/adminManagement',
            ncyBreadcrumb: {
                skip: true
            },
            // data: {
            //     requiredUserRole: USER_ROLES.root
            // },
        })
            .state('adminManagement.list', {
                // url: '/list?page&sortField&orderBy&search',
                url: '/list?page&search',
                views: {
                    'content@app': {
                        controller: 'AdminList',
                        templateUrl: 'adminManagement/adminList.tpl.html'
                    }
                },
                // resolve: {
                //     admins: function (AdminManager) {
                //         return AdminManager.one("listAdmin").getList();
                //     }
                // },
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
                    isNew: function () {
                        return true;
                    },
                    userProfile: function () {
                        return null;
                    }
                }
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
                    isNew: function () {
                        return false;
                    },
                    userProfile: function (AdminManager, $stateParams) {
                        return AdminManager.one($stateParams.id).get();
                    }
                }
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