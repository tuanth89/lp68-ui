(function () {
    'use strict';
    angular
        .module('ati.admin')
        .directive('eRouteName', function () {
            return {
                restrict: "A",
                scope: {
                    eRouteName: "@"
                },
                transclude: true,
                template: '<ng-transclude></ng-transclude>',
                link: function (scope, element, attrs, ctrl) {
                    scope.element = element;
                    $(element).hide();

                    scope.routeNames = scope.eRouteName.split(',');
                },
                controller: function ($scope, $rootScope) {
                    $rootScope.$watch("routeNames", function (userRouteNames) {
                        if (userRouteNames) {
                            let visible = true;
                            let count = 0;
                            $scope.routeNames.forEach(name => {
                                if (userRouteNames.indexOf(name) < 0) {
                                    count ++;
                                    
                                }
                            });

                            if(count==$scope.routeNames.length) visible = false;

                            if (visible) {
                                $($scope.element).show();
                            } else {
                                $($scope.element).hide();
                            }
                        }
                    })
                },
            }
        });
})();