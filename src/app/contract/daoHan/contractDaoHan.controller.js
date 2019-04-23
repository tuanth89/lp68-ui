(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractDaoHanController', ContractDaoHanController);

    function ContractDaoHanController($scope, CONTRACT_STATUS, CONTRACT_EVENT, $timeout, ContractManager, Restangular) {

        $scope.$on('$viewContentLoaded', function (event, data) {
            ContractManager.one('allContract').one('byType').getList("", {
                type: CONTRACT_STATUS.MATURITY,
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
                    width: 90,
                    readOnly: true
                }
            ],
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
                'Ngày đáo'
            ],
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.className = "hot-normal";
                cellPrp.readOnly = true;

                if (col === 1 || col === 2 || col === 7) {
                    cellPrp.renderer = myBtns;
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