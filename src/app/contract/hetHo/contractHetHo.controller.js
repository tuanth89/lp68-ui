(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractHetHoController', ContractHetHoController);

    function ContractHetHoController($scope, CONTRACT_STATUS, $timeout, CONTRACT_EVENT, hotRegisterer, ContractManager, Restangular) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;

        $scope.$on('$viewContentLoaded', function (event, data) {
            ContractManager.one('allContract').one('byType').getList("", {
                type: CONTRACT_STATUS.ACCOUNTANT_END,
                storeId: $scope.$parent.storeSelected.storeId,
                userId: $scope.$parent.storeSelected.userId
            })
                .then((contracts) => {
                    $scope.contracts = angular.copy(Restangular.stripRestangular(contracts));
                })
                .catch((error) => {

                });
        });

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

        let hotInstance = "";
        $scope.settings = {
            stretchH: "all",
            autoWrapRow: true,
            // rowHeaders: true,
            colHeaders: true,
            minSpareRows: 0,
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.readOnly = true;
                if (col === 1 || col === 2 || col === 7) {
                    cellPrp.renderer = myBtns;
                }

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('cusRow') >= 0) {
                    let selectedCus = angular.copy($scope.contracts[rowCol.row]);
                    $scope.$parent.getContractsByCus(selectedCus);
                }
            }
        };

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (col === 1) {
                // td.innerHTML = '<u><a ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
                td.innerHTML = '<u><a class="linkable cusRow" value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
            }

            if (col === 2 || col === 7) {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }
        }

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');
        }, 0);

    }
})();