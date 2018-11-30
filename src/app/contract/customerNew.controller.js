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
            loanMoney: "",
            actuallyCollectedMoney: "",
            loanDate: ""
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
            // afterCreateRow: function (index) {
            //     hotInstance.selectCell(index, 0);
            // },
            afterCreateRow: function (index) {                                // set focus to 1st cell in row
                console.log("Index afterCreateRow=" + index);
                this.selectCell(index, 0, 0, 0, true);
            },
            stretchH: "all",
            autoWrapRow: true
        };

        $scope.getData = function () {
            ContractManager.one("circulation").one("all")
                .getList("", {date: $scope.filter.date, type: 0})
                .then(function (resp) {
                    $scope.customers = resp;

                    customerItem.createdAt = $scope.filter.date;
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

            // hotInstance.addHook('afterCreateRow', function (index, amount) {
            //     hotInstance.selectCell(index, 0);
            // });

            document.addEventListener('keydown', function (e) {
                if (e.which === 9 && hotInstance) {
                    if (!hotInstance.getSelected())
                        return;

                    let rowIndex = $('.current').parent().index();
                    let colIndex = hotInstance.getSelected()[1];
                    let totalCols = hotInstance.countCols();
                    let totalRows = hotInstance.countRows();
                    if (colIndex === (totalCols - 1) && rowIndex === (totalRows - 1)) {
                        hotInstance.alter("insert_row", totalRows + 1);
                        $scope.customers[totalRows] = angular.copy(customerItem);
                    }
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