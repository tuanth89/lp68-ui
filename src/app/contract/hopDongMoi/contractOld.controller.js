(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('ContractTypeOldController', ContractTypeOldController);

    function ContractTypeOldController($scope, CONTRACT_EVENT, $timeout, StoreManager, hotRegisterer, ContractManager, Restangular, AlertService, CustomerManager, storeList) {
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

        $scope.$on(CONTRACT_EVENT.RESIZE_TABLE, function (event, data) {
            hotInstance.render();
        });

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

                    setTimeout(function () {
                        hotInstance.render();
                    }, 0);
                });

        };

        let hotInstance = "";
        $scope.settings = {
            beforeRemoveRow: function (index, amount) {
                if (hotInstance.countRows() <= 1)
                    return false;
            },
            afterCreateRow: function (index) {
                if (hotInstance.getSelected().length === 0)
                    return;
                setTimeout(function () {
                    let colIndex = hotInstance.getSelected()[1];
                    if (colIndex === 4)
                        hotInstance.selectCell(index, 0);
                }, 1);
            },
            cells: function (row, col) {
                let cellPrp = {};
                // let item = $scope.contracts[row];
                cellPrp.className = "hot-normal";
                cellPrp.readOnly = true;
                // if (typeof item === 'object' && item._id) {
                //     cellPrp.readOnly = true;
                // }
                // else
                //     cellPrp.className = "hot-normal";

                if (col === 0 || col === 1 || col === 7) {
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
            },
            copyPaste: false,
            stretchH: "all",
            autoWrapRow: true,
            colHeaders: true,
            minSpareRows: 0
            // strict: true
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
                    td.innerHTML = '<button class="btnAction btn btn-danger delRow" value="' + value + '" style="width:22px;"><span class="fa fa-trash"></span>&nbsp;</button>';
                else
                    td.innerHTML = '';
            }
        }

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

            $scope.onAfterInit = function () {
                hotInstance.validateCells();
            };

        }, 0);

        $scope.delContract = function (rowIndex, contractId) {
            if (!contractId && $scope.contracts.length === 1) {
                $scope.contracts.splice(rowIndex, 1);
            }
            else if (!contractId) {
                $scope.contracts.splice(rowIndex, 1);
            }

            $scope.$apply();
            hotInstance.render();

        };
    }
})();