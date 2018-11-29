(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerNewController', CustomerNewController);

    function CustomerNewController($scope, $stateParams, $timeout, $state, hotRegisterer, ContractManager, Restangular) {
        $scope.settings = {rowHeaders: true, colHeaders: true, minSpareRows: 1};
        $scope.rowHeaders = true;
        $scope.colHeaders = true;
        $scope.filter = {date: ""};
        $scope.$watch('filter.date', function (newValue, oldValue) {
            $timeout(function () {
                if (newValue != oldValue) {
                    $scope.getData();
                }
            }, 100);

        });
        $scope.filter.date = new Date();

        let hotInstance = "";
        let customerItem = {
            _id: "",
            contractNo: "",
            customer: {
                name: "",
                phone: "",
                _id: ""
            },
            loanMoney: 0,
            actuallyCollectedMoney: 0,
            loanDate: 0
        };
        $scope.customers = [];
        $scope.customers.push(angular.copy(customerItem));
        // $scope.customers = angular.copy(Restangular.stripRestangular(contracts));

        $scope.settings = {
            contextMenu: {
                items: {
                    'row_above': {name: 'Thêm dòng trên'},
                    'row_below': {name: 'Thêm dòng dưới'},
                    'remove_row': {name: 'Xóa'}
                }
                // callback: function (key, options) {
                //     if (key === 'remove_row') {
                //         if (hotInstance.countRows() > 1) {
                //             var indexArr = hot.getSelected();
                //             var selectedData = hot.getDataAtRow(indexArr[0]);
                //         }
                //     }
                // }
            },
            beforeRemoveRow: function (index, amount) {
                if (hotInstance.countRows() <= 1)
                    return false;
            },
            stretchH: "all",
            autoWrapRow: true
        };

        $scope.getData = function () {
            ContractManager.one("circulation").one("all")
                .getList("", {date: $scope.filter.date, type: 0})
                .then(function (resp) {
                    $scope.customers = resp;
                    $scope.customers.push(angular.copy(customerItem));
                });
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');

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

            hotInstance.addHook('afterCreateRow', function (index, amount) {
                hotInstance.selectCell(index, 0);
            });

            document.addEventListener('keydown', function (e) {
                if (e.which === 9 && hotInstance) {
                    if (!hotInstance.getSelected())
                        return;

                    let rowIndex = $('.current').parent().index();
                    let colIndex = hotInstance.getSelected()[1];
                    let totalCols = hotInstance.countCols();
                    let totalRows = hotInstance.countRows();
                    if (colIndex === (totalCols - 1) && rowIndex === (totalRows - 1))
                        hotInstance.alter("insert_row", totalRows + 1);
                }
            }, true);
        }, 0);

        $scope.saveCustomer = () => {
            let customers = angular.copy($scope.customers);
            _.remove(customers, function (item) {
                return !item.customer.name;
            });

            ContractManager.post(customers)
                .then((items) => {
                    $scope.customers = items;
                    $scope.customers.push(angular.copy(customerItem));
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        $scope.getData();

    }
})();