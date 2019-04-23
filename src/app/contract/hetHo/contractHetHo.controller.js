(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractHetHoController', ContractHetHoController);

    function ContractHetHoController($scope, CONTRACT_STATUS, $timeout, CONTRACT_EVENT, ContractManager, Restangular) {

        $scope.$on('$viewContentLoaded', function (event, data) {
            ContractManager.one('allContract').one('byType').getList("", {
                type: CONTRACT_STATUS.ACCOUNTANT_END,
                storeId: $scope.$parent.storeSelected.storeId,
                userId: $scope.$parent.storeSelected.userId
            })
                .then((contracts) => {
                    $scope.contracts = angular.copy(Restangular.stripRestangular(contracts));

                    hotTableInstance.updateSettings({
                        data: $scope.contracts

                    });

                    hotTableInstance.getInstance().render();
                })
                .catch((error) => {

                });
        });

        const container = document.getElementById('hotTable');
        const hotTableInstance = new Handsontable(container, {
            data: $scope.contracts,
            licenseKey: 'non-commercial-and-evaluation',
            columns: [
                {
                    data: 'contractNo',
                    type: 'text',
                    width: 170,
                    readOnly: true
                },
                {
                    data: 'customer.name',
                    type: 'text',
                    width: 150,
                    readOnly: true
                },
                {
                    data: 'createdAt',
                    type: 'text',
                    width: 100,
                    readOnly: true,
                },
                {
                    data: 'loanMoney',
                    type: 'numeric',
                    width: 100,
                    numericFormat: {
                        pattern: '#,###'
                    },
                    readOnly: true
                },
                {
                    data: 'actuallyCollectedMoney',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 100,
                    readOnly: true
                },
                {
                    data: 'totalMoneyNeedPay',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 120,
                    readOnly: true
                },
                {
                    data: 'totalMoneyPaid',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 100,
                    readOnly: true
                },
                {
                    data: 'loanDate',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '#,###'
                    },
                    width: 100,
                    readOnly: true
                },
                {
                    data: 'transferDate',
                    type: 'text',
                    width: 100,
                    readOnly: true
                }
            ],
            licenseKey: 'non-commercial-and-evaluation',
            stretchH: 'all',
            copyPaste: false,
            // autoWrapRow: true,
            // wordWrap: false,
            // preventOverflow: 'horizontal',
            // fixedColumnsLeft: 3,
            // manualColumnFreeze: true,
            // viewportColumnRenderingOffset: 100,
            // viewportRowRenderingOffset: 100,
            rowHeights: 35,
            colHeaders: [
                'Số hợp đồng',
                'Họ và tên',
                'Ngày vay',
                'Gói vay',
                'Thực thu',
                'Dư nợ',
                'Đã đóng',
                'Số ngày vay',
                'Ngày chuyển'
            ],
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.className = "hot-normal";
                cellPrp.readOnly = true;

                if (col === 1 || col === 2 || col === 8) {
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
        });

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
        }

    }
})();