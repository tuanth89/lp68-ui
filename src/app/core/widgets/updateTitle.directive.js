(function () {
    'use strict';

    angular.module('ati.core.widgets')
        .directive('updateTitle', updateTitle)
    ;

    function updateTitle($rootScope, $translate, $state, $interpolate, _) {
        return {
            link: function(scope, element) {
                var updateTitle = function() {
                    var pageTitle = '';
                    var state = $state.$current;

                    if(_.isObject(state.ncyBreadcrumb) && state.ncyBreadcrumb.label) {
                        var title = state.ncyBreadcrumb.label;
                        title = $interpolate(title)(state.locals.globals);

                        if (title) {
                            pageTitle = title + ' | ';
                        }
                    }

                    pageTitle += $translate.instant('APP_NAME');

                    element.text(pageTitle);
                };

                $rootScope.$on('$stateChangeSuccess', updateTitle);
            }
        };
    }
})();