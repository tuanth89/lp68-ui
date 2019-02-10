(function () {
    'use strict';

    angular.module('ati.adminManagement')
        .controller('AdminList', AdminList)
    ;

    function AdminList($scope, $state, $stateParams, $translate, AlertService, AdminManager) {
        $scope.confirmDelete = "Bạn có chắc chắn muốn xóa tài khoản này?";
        $scope.filter = angular.copy($stateParams);
        $scope.tableData = [];
        $scope.total = 0;

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.toggleStatus = function (user) {
            let newStatus = !user.enabled;

            AdminManager.one(user._id).customPUT({'enabled': newStatus})
                .then(function () {
                    user.enabled = newStatus;
                    AlertService.replaceAlerts({
                        type: 'success',
                        message: newStatus ? "Tài khoản đã được kích hoạt"
                            : "Tài khoản đã ngừng kích hoạt"
                    });
                })
                .catch(function () {
                    AlertService.replaceAlerts({
                        type: 'error',
                        message: ""
                    });
                });
        };

        $scope.delAccount = function (userId) {
            AdminManager.one(userId).remove()
                .then(function () {
                    AlertService.addFlash({
                        type: 'success',
                        message: "Xóa tài khoản thành công"
                    });
                })
                .then(function () {
                    $state.reload();
                })
                .catch(function () {
                    AlertService.replaceAlerts({
                        type: 'error',
                        message: $translate.instant('REQUEST_FAIL')
                    });
                })
            ;
        };

        $scope.table = {};

        $scope.keyword = $stateParams.search;

        $scope.filterSearch = function (e) {
            if (e.keyCode === 13) {
                $scope.keyword = $scope.filter.search;
                $scope.getData();
            }
        };

        // getData
        $scope.getData = function () {
            $scope.keyword = $scope.filter.search;

            return AdminManager
                .one("listAdmin")
                .customGET("", $scope.filter)
                .then(function (resp) {
                        let data = resp.plain();

                        $scope.tableData = data.docs;
                        $scope.total = data.total;
                    },
                    function (err) {
                    });
        };

    }
})();