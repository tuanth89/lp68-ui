(function () {
    'use strict';

    angular.module('ati.contract')
        .controller('CustomerNewController', CustomerNewController);

    function CustomerNewController($scope, $stateParams, $timeout, $state, hotRegisterer, customerSource, ContractManager, Restangular, Auth) {
        let currentUser = Auth.getSession();
        let customerS = angular.copy(Restangular.stripRestangular(customerSource));
        $scope.customerSource = _.map(customerS, 'name').join(',');

        let selectedStoreId = $scope.$parent.storeSelected.storeId;

        $scope.filter = {date: ""};
        $scope.$watch('filter.date', function (newValue, oldValue) {
            $timeout(function () {
                if (newValue != oldValue) {
                    $scope.getData();
                }
            }, 100);
        });

        $scope.$on('$viewContentLoaded', function (event, data) {
            $scope.getData();
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
            createdAt: $scope.filter.date,
            isHdLaiDung: false,
            isCustomerNew: true,
            storeId: selectedStoreId,
            creator: currentUser._id
        };

        $scope.customers = [];
        $scope.customers.push(angular.copy(customerItem));
        // $scope.customers = angular.copy(Restangular.stripRestangular(contracts));

        $scope.settings = {
            // contextMenu: {
            //     items: {
            //         'row_above': {name: 'Thêm dòng trên'},
            //         'row_below': {name: 'Thêm dòng dưới'},
            //         'remove_row': {name: 'Xóa'}
            //     }
            //     // callback: function (key, options) {
            //     //     if (key === 'remove_row') {
            //     //         if (hotInstance.countRows() > 1) {
            //     //             var indexArr = hot.getSelected();
            //     //             var selectedData = hot.getDataAtRow(indexArr[0]);
            //     //         }
            //     //     }
            //     // }
            // },
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

                // if (moment($scope.filter.date, "YYYY-MM-DD").isBefore(moment().format("YYYY-MM-DD"))) {
                //     cellPrp.readOnly = true;
                //     cellPrp.className = "handsontable-cell-disable";
                //     return cellPrp;
                // }

                cellPrp.className = "hot-normal";
                // cellPrp.readOnly = true;

                if (col === 1) {
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
                        else
                            $scope.customers[rowChecked].customer._id = "";

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
            colHeaders: true,
            minSpareRows: 0
            // strict: true
        };

        $scope.getData = function () {
            ContractManager.one("circulation").one("all")
                .getList("", {date: $scope.filter.date, type: 0, storeId: selectedStoreId})
                .then(function (resp) {
                    $scope.customers = angular.copy(Restangular.stripRestangular(resp));

                    customerItem.createdAt = $scope.filter.date;
                    // if (!moment($scope.filter.date, "YYYY-MM-DD").isBefore(moment().format("YYYY-MM-DD"))) {
                    $scope.customers.push(angular.copy(customerItem));
                    // }

                    setTimeout(function () {
                        hotInstance.render();
                    }, 0);
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
                        customerItem.createdAt = $scope.filter.date;
                        $scope.customers.push(angular.copy(customerItem));
                        // hotInstance.alter("insert_row", totalRows + 1);
                    }
                }
            }, true);
        }, 0);

        $scope.saveCustomer = () => {
            if (!selectedStoreId) {
                toastr.error("Chưa chọn cửa hàng!");
                return;
            }

            let customers = angular.copy($scope.customers);
            let checkValid = true;
            _.filter(customers, (item) => {
                if (!item.customer.name || !item.loanMoney || !item.actuallyCollectedMoney || !item.loanDate) {
                    checkValid = false;
                    return false;
                }
            });

            // _.remove(customers, function (item) {
            //     return !item.customer.name || item._id;
            // });

            if (!checkValid) {
                toastr.error("Chưa nhập đủ thông tin khách hàng!");
                return;
            }

            ContractManager.post(customers)
                .then((items) => {
                    // $scope.customers = items;
                    // customerItem.createdAt = $scope.filter.date;
                    // $scope.customers.push(angular.copy(customerItem));
                    $scope.getData();
                    toastr.success('Tạo mới hợp đồng thành công!');
                })
                .catch((error) => {
                    console.log(error);
                    toastr.error("Tạo mới hợp đồng thất bại. Hãy thử lại sau!");
                });
        };
    }
})();