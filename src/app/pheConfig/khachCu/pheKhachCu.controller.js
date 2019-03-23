(function () {
    'use strict';

    angular.module('ati.pheConfig')
        .controller('PheKhachCuController', PheKhachCuController);

    function PheKhachCuController($scope, $timeout, hotRegisterer, CONTRACT_EVENT, Restangular, PheConfigManager, Auth) {
        $scope.settings = {rowHeaders: true, colHeaders: true, minSpareRows: 1};

        let currentUser = Auth.getSession();
        let hotInstance = "";
        $scope.pheConfigs = [];

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

        $scope.formProcessing = false;

        $scope.settings = {
            cells: function (row, col) {
                let cellPrp = {};
                // cellPrp.className = "hot-normal";

                return cellPrp;
            },
            stretchH: "all",
            autoWrapRow: true
        };

        $scope.getData = function () {
            PheConfigManager.one('list').getList("", {isNewCustomer: false})
                .then((data) => {
                    $scope.pheConfigs = angular.copy(Restangular.stripRestangular(data));
                });
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');
        }, 0);

        $scope.savePheConfig = () => {
            // CustomerManager.one('insert').one('new').customPOST(customers)
            //     .then((items) => {
            //         // $scope.customers = angular.copy(Restangular.stripRestangular(items));
            //         // $scope.customers.push(angular.copy(customerItem));
            //         toastr.success('Cập nhật thành công!');
            //
            //         $scope.getData();
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //         toastr.error("Cập nhật thất bại!");
            //     });
        };

    }
})();