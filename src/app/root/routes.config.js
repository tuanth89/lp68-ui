(function () {
    'use strict';

    angular
        .module('ati.root')
        .config(addStates);

    function addStates($stateProvider, USER_ROLES) {
        $stateProvider
            .state('app.root', {
                abstract: true,
                views: {
                    'header@app': {
                        templateUrl: 'root/layout/header.tpl.html'
                    },
                    'nav@app': {
                        templateUrl: 'root/layout/nav.tpl.html'
                    }
                },
                url: '/admin',

                ncyBreadcrumb: {
                    skip: true
                },
                resolve: {
                    routeNames: function (AdminService) {
                        return AdminService.getFeatureAccessByCurentRole();
                    }
                }
            })

            .state('app.root.error', {
                abstract: true,
                url: '/error'
            })

            .state('app.root.error.404', {
                url: '/404',
                views: {
                    'content@app': {
                        controller: '404ErrorController'
                    }
                },
                ncyBreadcrumb: {
                    label: '404'
                }
            })

            .state('app.root.error.403', {
                url: '/403',
                views: {
                    'content@app': {
                        controller: '403ErrorController'
                    }
                },
                ncyBreadcrumb: {
                    label: '403'
                }
            })

            .state('app.root.error.400', {
                url: '/400',
                views: {
                    'content@app': {
                        controller: '400ErrorController'
                    }
                },
                ncyBreadcrumb: {
                    label: '400'
                }
            })

            .state('app.root.error.500', {
                url: '/500',
                views: {
                    'content@app': {
                        controller: '500ErrorController'
                    }
                },
                ncyBreadcrumb: {
                    label: '500'
                }
            });
    }
})();