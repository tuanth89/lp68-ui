(function () {
    'use strict';

    angular
        .module('ati.root.dashboard')
        .controller('RootDashboard', RootDashboard)
    ;

    function RootDashboard($scope, $translate, $filter, dashboard, UserStateHelper) {
        $scope.dashboard = angular.copy(dashboard) || {};
    }
})();