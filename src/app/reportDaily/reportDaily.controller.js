(function () {
    'use strict';

    angular.module('ati.reportDaily')
        .controller('ReportDailyController', ReportDailyController);

    function ReportDailyController($scope, $state, $stateParams, $compile, AlertService, Restangular, ReportDailyManager, ContractManager, storeList, StoreManager, Auth) {
        // let currentUser = Auth.getSession();
        $scope.filter = {
            date: moment().format("YYYY-MM-DD"),
            storeId: $scope.$parent.storeSelected.storeId,
            staffId: $scope.$parent.storeSelected.userId
        };

        $scope.stores = angular.copy(Restangular.stripRestangular(storeList));
        $scope.usersByStore = [];

        $scope.$watch('filter.date', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.getData();
            }
        });

        $scope.$watch('filter.storeId', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.getData();
            }
        });

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();

            // StoreManager.one('listForUser').getList()
            //     .then((stores) => {
            //         $scope.stores = angular.copy(Restangular.stripRestangular(stores));
            //
            //         StoreManager.one($scope.filter.storeId).one('listUserByStore').get()
            //             .then((store) => {
            //                 $scope.usersByStore = _.map(store.staffs, (item) => {
            //                     if (!item.isAccountant)
            //                         return item;
            //                 });
            //             }, (error) => {
            //             })
            //             .finally(() => {
            //             });
            //     });

            StoreManager.one($scope.filter.storeId).one('listUserByStore').get()
                .then((store) => {
                    $scope.usersByStore = _.map(store.staffs, (item) => {
                        if (!item.isAccountant)
                            return item;
                    });
                }, (error) => {
                })
                .finally(() => {
                });
        });

        $scope.selectedStoreEvent = function (item) {
            $scope.filter.staffId = "";
            $scope.getData();
            StoreManager.one(item._id).one('listUserByStore').get()
                .then((store) => {
                    $scope.usersByStore = _.map(store.staffs, (item) => {
                        if (!item.isAccountant)
                            return item;
                    });
                }, (error) => {
                })
                .finally(() => {
                });
        };

        $scope.selectedStaffEvent = function (item) {
            $scope.getData();
        };

        $scope.getData = function () {
            return ReportDailyManager
                .one()
                .customGET("byDate", $scope.filter)
                .then(function (resp) {
                    $scope.reportDailyItem = resp ? resp.plain() : {};
                });
        };

    }
})();