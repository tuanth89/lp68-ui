(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractKetThucController', ContractKetThucController);

    function ContractKetThucController($scope, $timeout, CONTRACT_STATUS, hotRegisterer, ContractManager, Restangular, CONTRACT_EVENT) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

        $scope.getData = () => {
            ContractManager.one('allContract').one('byType').getList("", {
                type: CONTRACT_STATUS.END,
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
            copyPaste: false,
            // autoWrapRow: true,
            // rowHeaders: true,
            colHeaders: true,
            minSpareRows: 0,
            wordWrap: false,
            fixedColumnsLeft: 3,
            manualColumnFreeze: true,
            cells: function (row, col) {
                let cellPrp = {};
                if (col === 1 || col === 2 || col === 8 || col === 9 || col === 10) {
                    cellPrp.renderer = myBtns;
                    cellPrp.readOnly = true;
                }
                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('cusRow') >= 0) {
                    let selectedCus = angular.copy($scope.contracts[rowCol.row]);
                    $scope.$parent.getContractsByCus(selectedCus);
                    return;
                }

                if (event.realTarget.className.indexOf('btnDuyet') >= 0 && $scope.$parent.storeSelected.userId) {
                    let contractSelected = angular.copy(Restangular.stripRestangular($scope.contracts[rowCol.row]));
                    let {actuallyCollectedMoney, totalMoneyPaid, moneyPaid} = contractSelected;

                    contractSelected.moneyContractOld = parseInt(actuallyCollectedMoney) - parseInt(totalMoneyPaid); // - parseInt(moneyPaid);
                    contractSelected.moneyNotEnough = 0;

                    contractSelected.totalMoney = contractSelected.moneyContractOld;
                    $scope.$parent.contractSelected = angular.copy(Restangular.stripRestangular(contractSelected));
                    $scope.$apply();

                    $('#duyetModal').modal('show');
                }
            }
        };

        function myBtns(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (cellProperties.prop === "customer.name") {
                // td.innerHTML = '<u><a ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
                td.innerHTML = '<u><a class="linkable cusRow" value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
            }

            if (cellProperties.prop === "createdAt" || cellProperties.prop === "transferDate") {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            if (cellProperties.prop === "status") {
                let statusName = "";
                switch (value) {
                    case 6:
                        statusName = "Kết thúc";
                        break;
                    case 7:
                        statusName = "Kết thúc đáo";
                        break;

                }
                td.innerHTML = '<button class="btnStatus btn status-' + value + '" value="' + 0 + '">' + statusName + '</button>';
            }

            if (cellProperties.prop === "actionTransf") {
                td.innerHTML = '<button class="btnStatus btnDuyet btn status-0">' + 'Duyệt' + '</button>';
            }
        }

        $scope.accountantEnd = () => {
            ContractManager
                .one($scope.contractSelected._id)
                .one('changeStatus')
                .customPUT({status: CONTRACT_STATUS.ACCOUNTANT_END})
                .then((contract) => {
                    toastr.success('Cập nhật thành công!');

                    $('#duyetModal').modal('hide');
                    $scope.getData();
                })
                .catch((error) => {
                    toastr.error('Cập nhật không thành công!');
                });
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');
        }, 0);

    }
})();