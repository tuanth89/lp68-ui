(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractBeController', ContractBeController);

    function ContractBeController($scope, CONTRACT_EVENT, $timeout, CONTRACT_STATUS, hotRegisterer, ContractManager, Restangular) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.UPDATE_SUCCESS, function () {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

        $scope.getData = () => {
            ContractManager.one('allContract').one('byType').getList("",
                {
                    type: CONTRACT_STATUS.ESCAPE,
                    storeId: $scope.$parent.storeSelected.storeId,
                    userId: $scope.$parent.storeSelected.userId
                })
                .then((contracts) => {
                    $scope.contracts = angular.copy(Restangular.stripRestangular(contracts));
                })
                .catch((error) => {

                });
        };

        let hotInstance = "";

        $scope.settings = {
            stretchH: "all",
            autoWrapRow: true,
            // rowHeaders: true,
            colHeaders: true,
            minSpareRows: 0,
            cells: function (row, col) {
                let cellPrp = {};
                if (col === 1 || col === 2 || col === 6 || col === 7 || col === 8) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }

                // if (col === 2 || col === 3) {
                //     cellPrp.className = "handsontable-td-red";
                // }
                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                // if (event.realTarget.className.indexOf('btnPay') >= 0) {
                //     hotInstance.setDataAtCell(rowCol.row, 5, parseInt(event.realTarget.innerText) * 1000);
                //     return;
                // }

                if (event.realTarget.className.indexOf('cusRow') >= 0) {
                    let selectedCus = angular.copy($scope.contracts[rowCol.row]);
                    $scope.$parent.getContractsByCus(selectedCus);
                    return;
                }

                if (event.realTarget.className.indexOf('btnStatus') >= 0 && $scope.$parent.storeSelected.userId) {
                    let contractSelected = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = contractSelected;

                    contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                    contractSelected.newPayMoney = 0;

                    contractSelected.totalMoney = contractSelected.moneyContractOld;
                    $scope.$parent.contractSelected = angular.copy(Restangular.stripRestangular(contractSelected));
                    $scope.$apply();

                    $('#dongTienModal').modal('show');

                }
            }
            // strict: true
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');
        }, 0);

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (col === 1) {
                // td.innerHTML = '<u><a ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
                td.innerHTML = '<u><a class="linkable cusRow" value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
            }

            if (col === 2 || col === 6 || col === 7) {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            if (col === 8) {
                td.innerHTML = '<button class="btnStatus btn status-0">' + 'Đóng' + '</button>';
            }
        }

    }
})();