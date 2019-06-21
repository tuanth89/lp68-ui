(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractTypeOldController', ContractTypeOldController);

    function ContractTypeOldController($scope, $timeout, ContractManager, AdminService, Restangular, storeList, CONTRACT_EVENT) {
        let storeArr = angular.copy(Restangular.stripRestangular(storeList));
        $scope.contracts = [];

        let selectedStoreId = $scope.$parent.storeSelected.storeId;
        let storeCode = "";
        let storeItem = _.find(storeArr, {_id: selectedStoreId});
        if (storeItem) {
            storeCode = storeItem.storeId;
        }

        $scope.userSelected = {storeId: $scope.$parent.storeSelected.storeId, id: $scope.$parent.storeSelected.userId};
        $scope.stores = [];
        $scope.usersByStore = [];

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            setTimeout(function () {
                hotTableInstance.render();
            }, 1);

        });

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
        });

        $scope.filter = {date: ""};
        $scope.$watch('filter.date', function (newValue, oldValue) {
            $timeout(function () {
                if (newValue !== oldValue) {
                    $scope.getData();
                }
            }, 100);
        });
        $scope.filter.date = moment(new Date()).format("YYYY-MM-DD");

        $scope.getData = () => {
            ContractManager
                .one("newOrOld")
                .one("all")
                .getList("", {
                    date: $scope.filter.date,
                    isCustomerNew: false,
                    storeId: selectedStoreId,
                    customerCode: $scope.$parent.storeSelected.userCode
                })
                .then(function (resp) {
                    $scope.contracts = angular.copy(Restangular.stripRestangular(resp));

                    hotTableInstance.updateSettings({
                        data: $scope.contracts

                    });

                    hotTableInstance.getInstance().render();
                });

        };

        const container = document.getElementById('hotContractOldTable');
        let columnsSetting = [
            {
                data: 'contractNo',
                type: 'text',
                width: 160,
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
                width: 100,
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
                width: 90,
                readOnly: true
            },
            {
                data: 'note',
                type: 'text',
                width: 250,
                readOnly: true
            },
            {
                data: 'actionDel',
                type: 'text',
                width: 40,
                readOnly: true
            }
        ];
        let colHeaderSetting = [
            'Số hợp đồng',
            'Họ và tên',
            'Ngày vay',
            'Gói vay',
            'Thực thu',
            'Dư nợ',
            'Đã đóng',
            'Số ngày vay',
            'Ghi chú',
            ' '
        ];
        const hotTableInstance = new Handsontable(container, {
            data: $scope.contracts,
            columns: columnsSetting,
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
            licenseKey: 'non-commercial-and-evaluation',
            colHeaders: colHeaderSetting,
            cells: function (row, col) {
                let cellPrp = {};
                // let item = $scope.contracts[row];
                cellPrp.className = "hot-normal";
                cellPrp.readOnly = true;

                if (col === 1 || col === 2 || col === 9) {
                    cellPrp.renderer = columnRenderer;
                }

                // if (!$scope.$parent.storeSelected.userId)
                //     cellPrp.readOnly = true;

                return cellPrp;
            },
            afterOnCellMouseDown: function (event, rowCol, TD) {
                if (event.realTarget.className.indexOf('cusRow') >= 0) {
                    let selectedCus = angular.copy($scope.contracts[rowCol.row]);
                    $scope.$parent.getContractsByCus(selectedCus);
                }
            }
        });

        AdminService.checkRole(['contract.remove']).then(function (allowRole) {
            $scope.roleRemove = allowRole;

            if (!allowRole) {
                // $('td:nth-child(8),th:nth-child(8)').addClass('hidden');

                columnsSetting.splice(-1, 1);
                colHeaderSetting.splice(-1, 1);

                hotTableInstance.updateSettings({
                    columns: columnsSetting,
                    colHeaders: colHeaderSetting
                });

                hotTableInstance.getInstance().render();
            }
        });

        function columnRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);

            if (cellProperties.prop === "customer.name") {
                // td.innerHTML = '<u><a ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
                td.innerHTML = '<u><a class="linkable cusRow value="' + value + '" ng-click="viewCustomerCalendar(' + value + ')">' + value + '</a></u>';
            }

            if (cellProperties.prop === "createdAt") {
                if (value)
                    td.innerHTML = moment(value).format("DD/MM/YYYY");
                else
                    td.innerHTML = '';
            }

            if (cellProperties.prop === "actionDel") {
                if ($scope.$parent.storeSelected.userId)
                    td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '" style="width:22px;"><span class="fa fa-trash delRow"></span></button>';
                else
                    td.innerHTML = '';

                // td.hidden = $scope.roleRemove;
            }
        }

        // $timeout(function () {
        // hotInstance = hotRegisterer.getInstance('my-handsontable');
        //
        // $scope.onAfterInit = function () {
        //     hotInstance.validateCells();
        // };

        // }, 0);

        $scope.delContract = function (rowIndex, contractId) {
            if (!contractId && $scope.contracts.length === 1) {
                $scope.contracts.splice(rowIndex, 1);
            } else if (!contractId) {
                $scope.contracts.splice(rowIndex, 1);
            }

            hotTableInstance.updateSettings({
                data: $scope.contracts

            });

            hotTableInstance.getInstance().render();

        };
    }
})();
