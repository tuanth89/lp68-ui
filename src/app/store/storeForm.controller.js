(function () {
    'use strict';

    angular.module('ati.admin')
        .controller('StoreFormController', StoreFormController);

    function StoreFormController($scope, $stateParams, $state, $timeout, StoreManager, Restangular) {
        $scope.store = {storeId: "", name: "", description: "", isActive: true};
        $scope.formProcessing = false;
        let storeObjectId = $stateParams.id;

        $scope.$on('$viewContentLoaded', function (event, data) {
            var stateName = $state.current.name;
            if (stateName.indexOf("store.edit") != -1) {
                $scope.mode = 'edit';

                $scope.getById();
            } else if (stateName.indexOf("store.detail") != -1) {
                $scope.mode = 'detail';

                $scope.getById();
            } else {
                $scope.mode = "add";
            }
        });

        $scope.getById = function () {
            StoreManager
                .one($stateParams.id)
                .get()
                .then(function (resp) {
                    $scope.store = angular.copy(Restangular.stripRestangular(resp));
                    $timeout(function () {
                        $scope.form_original_data = $("#storeForm").serialize();
                    }, 50)
                });
        };

        $scope.submit = function () {
            if ($scope.formProcessing)
                return;

            $scope.formProcessing = true;
            if (storeObjectId) {
                StoreManager.one().customPUT($scope.store)
                    .then(function (resp) {
                        $scope.form_original_data = $("#storeForm").serialize();
                        toastr.success("Cập nhật cửa hàng thành công!");
                        $state.go("^.list");
                    }, function (resp) {
                        if (resp.data && resp.data.message)
                            toastr.error(resp.data.message);
                    })
                    .finally(() => {
                        $scope.formProcessing = false;
                    });

            } else {
                StoreManager
                    .one()
                    .customPOST($scope.store)
                    .then(function (resp) {
                        $scope.form_original_data = $("#storeForm").serialize();
                        toastr.success("Thêm mới cửa hàng thành công!");
                        $state.go("^.list");
                    }, function (resp) {
                        if (resp.data && resp.data.message)
                            toastr.error(resp.data.message);
                    })
                    .finally(() => {
                        $scope.formProcessing = false;
                    });
            }
        };

        $scope.isFormValid = function () {
            return $scope.storeForm.$valid;
        };

        // $scope.$on('$stateChangeStart', function (event) {
        //     if ($("#storeForm").serialize() !== $scope.form_original_data) {
        //         let confirmBack = confirm("Các nội dung sẽ không được lưu nếu bạn quay trở lại.");
        //         if (confirmBack === false) {
        //             event.preventDefault();
        //             return;
        //         }
        //     }
        // });

        $timeout(function () {
            $scope.form_original_data = $("#storeForm").serialize();
        }, 0);
    };
})();