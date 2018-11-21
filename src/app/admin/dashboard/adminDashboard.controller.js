(function () {
    'use strict';

    angular
        .module('ati.admin')
        .controller('AdminDashboard', AdminDashboard);

    function AdminDashboard($scope, UserStateHelper) {
        $scope.dashboardItem = [];
        let baseSate = UserStateHelper.getBaseState();
        $scope.studentListUrl = baseSate + '.studentManagement.list';
        $scope.courseListUrl = baseSate + '.course.list';

    }
})();