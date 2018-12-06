(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerNewController', CustomerNewController);

    function CustomerNewController($scope, $stateParams, $timeout, $state, hotRegisterer, customerSource, ContractManager, Restangular) {
        $scope.rowHeaders = true;
        $scope.colHeaders = true;
        let customerS = angular.copy(Restangular.stripRestangular(customerSource));
        $scope.customerSource = _.map(customerS, 'name').join(',');

        $scope.filter = {date: ""};
        $scope.$watch('filter.date', function (newValue, oldValue) {
            $timeout(function () {
                if (newValue != oldValue) {
                    $scope.getData();
                }
            }, 100);

        });

        $scope.filter.date = moment(new Date()).format("YYYY-MM-DD");

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
            loanDate: "",
            createdAt: $scope.filter.date
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
            afterCreateRow: function (index) {
                setTimeout(function () {
                    let colIndex = hotInstance.getSelected()[1];
                    if (colIndex === 4)
                        hotInstance.selectCell(index, 0);
                }, 1);
            },
            cells: function (row, col) {
                let cellPrp = {};
                cellPrp.className = "hot-normal";
                // cellPrp.readOnly = true;

                if (col === 0) {
                    cellPrp.type = 'autocomplete';
                    cellPrp.source = _.map(customerS, 'name');

                    // hotInstance.updateSettings($scope.settings);
                    // cellPrp.datarows = $scope.customerSource;
                    // cellPrp.editor = 'select2';
                    // cellPrp.renderer = customDropdownRenderer;
                    // cellPrp.width = '200px';
                    // cellPrp.select2Options = {
                    //     data: optionsList,
                    //     dropdownAutoWidth: true,
                    //     width: 'resolve'
                    // };
                }

                return cellPrp;
            },
            afterChange: function (source, changes) {
                if (changes === 'edit') {
                    if (source[0][1] === "customer.name") {
                        let rowChecked = source[0][0];
                        let newValue = source[0][3];
                        let customerItem = _.find(customerS, {name: newValue});
                        if (customerItem) {
                            $scope.customers[rowChecked].customer._id = customerItem._id;
                        }

                        console.log($scope.customers[rowChecked]);

                        // console.log('row: ' + source[0][0]);
                        // console.log('col: ' + source[0][1]);
                        // console.log('old value: ' + source[0][2]);
                        // console.log('new value: ' + source[0][3]);
                    }
                }
            },
            /*afterCreateRow: function (index) {
             setTimeout(function () {
             this.selectCell(index, 0, 0, 0, true);
             }, 1);
             },*/
            stretchH: "all",
            autoWrapRow: true,
            rowHeaders: true,
            colHeaders: true,
            minSpareRows: 1
            // strict: true
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

                        customerItem.createdAt = $scope.filter.date;
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

                    customerItem.createdAt = $scope.filter.date;
                    $scope.customers.push(angular.copy(customerItem));
                    toastr.success('Tạo mới hợp đồng thành công!');
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Tạo mới hợp đồng thất bại. Hãy thử lại sau!");
                });
        };

        $scope.getData();

    }
})();