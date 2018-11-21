(function () {
    'use strict';

    angular.module('ati.adminManagement')
        .controller('AdminList', AdminList)
    ;

    function AdminList($scope, $state, $translate, admins, AlertService, HISTORY_TYPE_PATH, AdminManager) {
        $scope.admins = admins;
        $scope.confirmDelete = $translate.instant('USERS_MANAGEMENT_MODULE.DELETE_CONFIRM');

        $scope.hasData = function () {
            return !!admins.length;
        };

        if (!$scope.hasData()) {
            AlertService.replaceAlerts({
                type: 'warning',
                message: $translate.instant('USERS_MANAGEMENT_MODULE.CURRENTLY_NO_CONTENT_MANAGER')
            });
        }

        $scope.showPagination = showPagination;

        $scope.tableConfig = {
            itemsPerPage: 10,
            maxPages: 10
        };

        $scope.toggleStatus = function (user) {
            var newStatus = !user.enabled;

            StudentManager.one(user._id).customPUT({'enabled': newStatus})
                .then(function () {
                    user.enabled = newStatus;
                    AlertService.replaceAlerts({
                        type: 'success',
                        message: newStatus ? $translate.instant('USERS_MANAGEMENT_MODULE.ACTIVE_STATUS_SUCCESS')
                            : $translate.instant('USERS_MANAGEMENT_MODULE.DEACTIVE_STATUS_SUCCESS')
                    });
                })
                .catch(function () {
                    AlertService.replaceAlerts({
                        type: 'error',
                        message: $translate.instant('USERS_MANAGEMENT_MODULE.UPDATE_STATUS_FAIL')
                    });
                })

            ;
        };

        $scope.delAccount = function (userId) {
            AdminManager.one(userId).remove()
                .then(function () {
                    AlertService.addFlash({
                        type: 'success',
                        message: $translate.instant('USERS_MANAGEMENT_MODULE.DELETE_SUCCESS')
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


        function showPagination() {
            return angular.isArray($scope.admins) && $scope.admins.length > $scope.tableConfig.itemsPerPage;
        }

        $scope.sortableFields = ['name', 'username', 'email', 'phone', 'enabled'];
        $scope.sortStatus = {'name': true, 'username': true, 'email': true, 'phone': true, 'enabled': true};

        $scope.getSortIcon = (predicate, currentPredicate, descending) => {
            // if ($scope.sortableFields.indexOf(predicate) === -1) return "fa fa-minus";
            if (predicate !== currentPredicate) {
                return "fa fa-minus";
            }

            $scope.sortStatus[predicate] = descending;

            if ($scope.sortStatus[predicate]) {
                return "fa fa-angle-down";
            }

            return "fa fa-angle-up"
        };
    }
})();