(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractNewController', ContractNewController);

    function ContractNewController($scope, $timeout, ContractManager, AdminService, Restangular, storeList) {
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

        const container = document.getElementById('hotTable');
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
            ' '
        ];
        const hotTableInstance = new Handsontable(container, {
            data: $scope.contracts,
            columns: columnsSetting,
            stretchH: 'all',
            copyPaste: false,
            licenseKey: 'non-commercial-and-evaluation',
            // autoWrapRow: true,
            // wordWrap: false,
            // preventOverflow: 'horizontal',
            // fixedColumnsLeft: 3,
            // manualColumnFreeze: true,
            // viewportColumnRenderingOffset: 100,
            // viewportRowRenderingOffset: 100,
            rowHeights: 35,
            colHeaders: colHeaderSetting,
            cells: function (row, col) {
                let cellPrp = {};
                // let item = $scope.contracts[row];
                cellPrp.className = "hot-normal";
                cellPrp.readOnly = true;

                if (col === 1 || col === 2 || col === 8) {
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

        $scope.getData = () => {
            ContractManager
                .one("newOrOld")
                .one("all")
                .getList("", {
                    date: $scope.filter.date,
                    isCustomerNew: true,
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
                    td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '" style="width: 22px;"><span class="fa fa-trash delRow"></span>&nbsp;</button>';
                else
                    td.innerHTML = '';

                // td.hidden = $scope.roleRemove;
            }
        }

        $timeout(function () {
            // hotInstance = hotRegisterer.getInstance('my-handsontable');
            //
            // $scope.onAfterInit = function () {
            //     hotInstance.validateCells();
            // };

            // hotInstance.addHook('afterSelectionEnd',
            //     function (rowId, colId, rowEndId, colEndId) {
            //         if (colId === 2 || colId === 3)
            //             hotInstance.setDataAtCell(rowId, 4, 100);
            //     });

            // hotInstance.addHook('afterChange',
            //     function(changes, source) {
            //         if (changes !== null) {
            //             changes.forEach(function(item) {
            //                 if (hotInstance.propToCol(item[1]) === 2 || hotInstance.propToCol(item[1]) === 3) {
            //                     hotInstance.setDataAtCell(item[0], 4, 100);
            //                 }
            //             });
            //         }
            //     }), hotInstance;

            // hotInstance.addHook('afterCreateRow', function (index, amount) {
            //     hotInstance.selectCell(index, 0);
            // });

        }, 0);

        $scope.delContract = function (rowIndex, contractId) {
            if (!contractId && $scope.contracts.length === 1) {
                $scope.contracts.splice(rowIndex, 1);
            }
            else if (!contractId) {
                $scope.contracts.splice(rowIndex, 1);
            }

            // $scope.$apply();

            hotTableInstance.updateSettings({
                data: $scope.contracts

            });

            hotTableInstance.getInstance().render();

        };
    }
})();